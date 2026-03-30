import Groq from "groq-sdk";
import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { duties, totalItems } = req.body as {
    duties: string[];
    totalItems: number;
  };

  if (!duties?.length)
    return res.status(400).json({ error: "duties is required" });

  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

  // ---- fallback(LLM 실패시 로컬 가공) ----
  const stopwords = new Set([
    "서비스",
    "외국어",
    "학습",
    "랭디",
    "시장",
    "성장",
    "미래",
    "도전",
    "개발",
  ]);

  const normalize = (s: string) =>
    s
      .replace(/^["'`]+|["'`]+$/g, "")
      .replace(/[ㆍ•·]/g, "")
      .replace(/\s+/g, " ")
      .trim();

  const canonicalize = (s: string) => {
    const map: Record<string, string> = {
      ReactJs: "React",
      ReactJS: "React",
      "React.js": "React",
      NextJs: "Next.js",
      NextJS: "Next.js",
      "Restful API": "REST API",
      RestAPI: "REST API",
      restAPI: "REST API",
      GraphQL: "GraphQL",
      WebRTC: "WebRTC",
      WebSocket: "WebSocket",
      "TanStack Query": "TanStack Query",
      "Tanstack Query": "TanStack Query",
      Zustand: "Zustand",
      Jotai: "Jotai",
      Vite: "Vite",
      TurboRepo: "Turborepo",
      pnpm: "pnpm",
      GitHub: "GitHub",
      GitLab: "GitLab",
      AWS: "AWS",
      Docker: "Docker",
      Kubernetes: "Kubernetes",
      NestJS: "NestJS",
      TypeScript: "TypeScript",
      JavaScript: "JavaScript",
      Flutter: "Flutter",
      "React Native": "React Native",
    };
    return map[s] ?? s;
  };

  const computeLocalKeywords = () => {
    const lines = duties.map((d) => normalize(String(d ?? ""))).filter(Boolean);
    const counts = new Map<string, number>();

    const add = (kw: string, lineIdx: number, seenInLine: Set<string>) => {
      const k = canonicalize(normalize(kw));
      if (!k) return;
      if (k.length < 2) return;
      if (stopwords.has(k)) return;
      if (seenInLine.has(k)) return;
      seenInLine.add(k);
      counts.set(k, (counts.get(k) ?? 0) + 1);
    };

    // 1) 강한 시그널(기술/도구/프레임워크) 우선 추출
    const strongPatterns: Array<{ label: string; re: RegExp }> = [
      { label: "React Native", re: /react\s*native/i },
      { label: "Next.js", re: /next\.?js/i },
      { label: "React", re: /\breact\b/i },
      { label: "TypeScript", re: /typescript|ts\b/i },
      { label: "JavaScript", re: /javascript|es6\+?/i },
      { label: "WebRTC", re: /webrtc/i },
      { label: "WebSocket", re: /websocket/i },
      { label: "GraphQL", re: /graphql/i },
      { label: "REST API", re: /rest(\s*ful)?\s*api|restapi/i },
      { label: "Zustand", re: /zustand/i },
      { label: "Jotai", re: /jotai/i },
      { label: "TanStack Query", re: /tanstack\s*query/i },
      { label: "Vite", re: /\bvite\b/i },
      { label: "Turborepo", re: /turbo\s*repo|turborepo/i },
      { label: "pnpm", re: /\bpnpm\b/i },
      { label: "Docker", re: /\bdocker\b/i },
      { label: "Kubernetes", re: /\bkubernetes\b|\bk8s\b/i },
      { label: "AWS", re: /\baws\b/i },
      { label: "NestJS", re: /\bnestjs\b/i },
      { label: "Spring", re: /spring\s*(boot|framework)?/i },
      { label: "Prisma", re: /\bprisma\b/i },
      { label: "PostgreSQL", re: /postgres(ql)?/i },
      { label: "Redis", re: /\bredis\b/i },
      { label: "RabbitMQ", re: /\brabbitmq\b/i },
      { label: "CI/CD", re: /ci\/cd|pipeline|deployment|release/i },
      { label: "Design System", re: /design\s*system/i },
      {
        label: "Component Library",
        re: /component\s*library|common\s*component/i,
      },
      {
        label: "Performance Optimization",
        re: /성능\s*최적화|performance|optimization/i,
      },
      {
        label: "Data Visualization",
        re: /시각화|dashboard|chart|charting|heatmap|grid/i,
      },
      { label: "AI/LLM", re: /\b(ai|llm|nlp)\b|인공지능/i },
    ];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const seen = new Set<string>();
      for (const p of strongPatterns) {
        if (p.re.test(line)) add(p.label, i, seen);
      }

      // 2) 추가 토픽: 한국어 키워드(2~6자) 일부만 뽑기
      const koreanWords = line.match(/[가-힣]{2,8}/g) ?? [];
      for (const w of koreanWords) {
        // 너무 흔한 단어들 제외(간단)
        if (
          [
            "작성",
            "공유",
            "조정",
            "수행",
            "경험",
            "협업",
            "관리",
            "운영",
            "개선",
            "설계",
            "구현",
          ].includes(w)
        )
          continue;
        add(w, i, seen);
      }
    }

    const sorted = Array.from(counts.entries())
      .map(([keyword, count]) => ({ keyword, count }))
      .sort((a, b) => b.count - a.count);

    return sorted;
  };

  // ---- Groq 시도 (실패 시 로컬 fallback) ----
  let keywords: { keyword: string; count: number }[] | null = null;
  try {
    // 입력이 너무 커지면 실패/과금이 커지므로 샘플링 + 길이 제한
    const MAX_SAMPLE_LINES = 220;
    const MAX_SAMPLE_CHARS = 9000;
    const step = Math.max(1, Math.floor(duties.length / MAX_SAMPLE_LINES));
    const sampled = duties
      .filter((_, i) => i % step === 0)
      .slice(0, MAX_SAMPLE_LINES);
    let sample = sampled.join("\n");
    if (sample.length > MAX_SAMPLE_CHARS)
      sample = sample.slice(0, MAX_SAMPLE_CHARS);

    const chat = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      temperature: 0.1,
      messages: [
        {
          role: "system",
          content:
            "You are a keyword extractor. Extract noun keywords (2-4 words/phrases) from job duty descriptions and return ONLY a JSON array. No explanation, no markdown.",
        },
        {
          role: "user",
          content: `다음은 프론트엔드 채용공고의 주요업무 목록입니다.
핵심 명사 키워드를 추출하고 각 키워드가 몇 개의 항목(줄)에 등장하는지 빈도를 계산하여 상위 50개를 반환하세요.
반드시 JSON 배열만 반환하세요. 다른 텍스트 없이.
형식: [{"keyword": "키워드", "count": 숫자}]
주요업무 목록:
${sample}`,
        },
      ],
    });

    const raw = chat.choices[0]?.message?.content ?? "[]";
    const jsonMatch = raw.match(/\[[\s\S]*\]/);
    const parsed = JSON.parse(jsonMatch ? jsonMatch[0] : raw) as Array<{
      keyword: string;
      count: number;
    }>;
    keywords = parsed.map((k) => ({
      keyword: canonicalize(normalize(k.keyword)),
      count: Number(k.count ?? 0),
    }));
  } catch (e) {
    console.error("Groq failed; falling back to local extraction.", e);
    // fallback
    keywords = computeLocalKeywords();
  }

  const deduped = new Map<string, { keyword: string; count: number }>();
  for (const k of keywords) {
    const keyword = String(k.keyword ?? "").trim();
    if (!keyword) continue;
    if (stopwords.has(keyword)) continue;

    const prev = deduped.get(keyword);
    if (!prev || k.count > prev.count) {
      deduped.set(keyword, { keyword, count: k.count });
    }
  }

  const sorted = Array.from(deduped.values()).sort((a, b) => b.count - a.count);
  const candidates = sorted.slice(0, 60);

  // Frequency만으로 상위 20개를 자르면 특정 토픽(기술/아키텍처/협업/성능 등)이 누락될 수 있어
  // 카테고리별로 최소 1개씩 먼저 뽑고, 그 다음 빈자리를 빈도 순으로 채웁니다.
  const categoryRules: Array<{
    category: string;
    test: (keyword: string) => boolean;
  }> = [
    { category: "react", test: (k) => /react/i.test(k) },
    { category: "nextjs", test: (k) => /next(\.js)?/i.test(k) },
    { category: "typescript", test: (k) => /typescript/i.test(k) },
    { category: "javascript", test: (k) => /javascript/i.test(k) },
    { category: "webrtc", test: (k) => /webrtc/i.test(k) },
    { category: "websocket", test: (k) => /websocket/i.test(k) },
    { category: "ai", test: (k) => /\b(ai|llm|nlp)\b/i.test(k) },
    {
      category: "state",
      test: (k) => /zustand|jotai|state management|tanstack query/i.test(k),
    },
    {
      category: "designsystem",
      test: (k) => /design system|common component|component library/i.test(k),
    },
    {
      category: "performance",
      test: (k) => /performance|optimization|render|lighthouse/i.test(k),
    },
    { category: "testing", test: (k) => /jest|e2e|test/i.test(k) },
    {
      category: "deployment",
      test: (k) => /cicd|deployment|pipeline|release/i.test(k),
    },
    { category: "graphql", test: (k) => /graphql/i.test(k) },
    {
      category: "restapi",
      test: (k) => /rest(\.|\s)?api|restful api/i.test(k),
    },
    {
      category: "mobile",
      test: (k) => /react native|flutter|android|ios/i.test(k),
    },
    {
      category: "data",
      test: (k) =>
        /chart|charting|dashboard|visualization|grid|heatmap/i.test(k),
    },
  ];

  const selected: Array<{ keyword: string; count: number }> = [];
  const selectedKeywords = new Set<string>();
  const pickedCategories = new Set<string>();

  for (const rule of categoryRules) {
    for (const c of candidates) {
      if (pickedCategories.has(rule.category)) break;
      const kw = c.keyword ?? "";
      if (selectedKeywords.has(kw)) continue;
      if (!rule.test(kw)) continue;

      selected.push(c);
      selectedKeywords.add(kw);
      pickedCategories.add(rule.category);
      break;
    }
  }

  for (const c of candidates) {
    if (selected.length >= 20) break;
    const kw = c.keyword ?? "";
    if (selectedKeywords.has(kw)) continue;
    selected.push(c);
    selectedKeywords.add(kw);
  }

  const result = selected.slice(0, 20).map((k) => ({
    keyword: k.keyword,
    count: k.count,
    percent: Math.round((k.count / (totalItems || 1)) * 100),
  }));

  return res.status(200).json({ keywords: result });
}
