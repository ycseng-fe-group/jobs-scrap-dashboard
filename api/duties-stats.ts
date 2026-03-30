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

  const sample = duties.join("\n");

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
핵심 명사 키워드를 추출하고 각 키워드가 몇 개의 항목(줄)에 등장하는지 빈도를 계산하여 상위 80개를 반환하세요.
범용 단어들(예: "서비스", "외국어", "학습", "랭디", "시장", "성장", "미래", "도전", "개발")은 되도록 제외하고,
기술 스택(React/Next.js/Socket/WebRTC/AI 등), 상태관리/서버상태, 컴포넌트/디자인시스템, 성능최적화, 협업/테스트/배포 같은 구체 토픽이 골고루 섞이도록 '폭'을 우선하세요.
또한 서로 다른 토픽이 모두 최소 1개씩 나타나도록 결과를 균형 있게 만들어 주세요.
반드시 JSON 배열만 반환하세요. 다른 텍스트 없이.
형식: [{"keyword": "키워드", "count": 숫자}]
주요업무 목록:
${sample}`,
      },
    ],
  });

  const raw = chat.choices[0]?.message?.content ?? "[]";

  let keywords: { keyword: string; count: number }[];
  try {
    const jsonMatch = raw.match(/\[[\s\S]*\]/);
    keywords = JSON.parse(jsonMatch ? jsonMatch[0] : raw);
  } catch {
    return res
      .status(500)
      .json({ error: "Failed to parse Groq response", raw });
  }

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
    { category: "state", test: (k) => /zustand|jotai|state management|tanstack query/i.test(k) },
    { category: "designsystem", test: (k) => /design system|common component|component library/i.test(k) },
    { category: "performance", test: (k) => /performance|optimization|render|lighthouse/i.test(k) },
    { category: "testing", test: (k) => /jest|e2e|test/i.test(k) },
    { category: "deployment", test: (k) => /cicd|deployment|pipeline|release/i.test(k) },
    { category: "graphql", test: (k) => /graphql/i.test(k) },
    { category: "restapi", test: (k) => /rest(\.|\s)?api|restful api/i.test(k) },
    { category: "mobile", test: (k) => /react native|flutter|android|ios/i.test(k) },
    { category: "data", test: (k) => /chart|charting|dashboard|visualization|grid|heatmap/i.test(k) },
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
