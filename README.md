# jobs-scrap-dashboard 프로젝트 생성 명세서

## 프로젝트 개요

**목적**: 프론트엔드 채용공고 스크래퍼(`jobs-scrap`)가 Supabase에 수집한 데이터를 시각화하여,
기업이 요구하는 기술 스택과 역량 트렌드를 탐색하는 개인용 대시보드.

**데이터 소스**: Supabase `job_postings` 테이블 (읽기 전용, RLS public read 허용)

---

## 기술 스택

| 항목          | 선택                    |
| ------------- | ----------------------- |
| 프레임워크    | Next.js 15 (App Router) |
| 언어          | TypeScript              |
| 스타일링      | Tailwind CSS            |
| 차트          | Recharts                |
| DB 클라이언트 | @supabase/supabase-js   |
| 배포          | Vercel                  |

---

## 데이터 소스 스키마

```ts
type JobPosting = {
  id: string; // uuid
  source: "wanted" | "jobkorea";
  source_id: string;
  title: string;
  company: string;
  url: string;
  description: string;
  tech_stacks: string[]; // ['React', 'TypeScript', ...]
  required: string[]; // 자격 요건 항목
  preferred: string[]; // 우대 사항 항목
  duties: string[]; // 주요 업무 항목
  scraped_at: string; // 'YYYY-MM-DD'
  created_at: string;
  updated_at: string;
};
```

**Supabase 연결 환경변수**

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

---

## 페이지 구성

### 1. `/` — 홈 (현황 요약)

**상단 KPI 카드 4개**

- 전체 공고 수
- Wanted 공고 수
- 잡코리아 공고 수
- 마지막 수집일

**차트 2개**

- 기술 스택 Top 15 가로 바 차트 (전체 기간 합산)
- 날짜별 수집 공고 수 라인 차트 (출처별 색상 구분)

---

### 2. `/trends` — 기술 트렌드

**필터**

- 카테고리 탭: 전체 / 프레임워크 / 언어 / 상태관리 / 스타일링 / 빌드도구 / 테스트 / 데이터페칭

**차트**

- 기술별 시계열 라인 차트 (x축: scraped_at, y축: 공고 수, 기술별 라인)
- 기술 스택 조합 빈도 테이블 (예: React + TypeScript 함께 등장 횟수)

**기술 카테고리 정의**

```ts
const TECH_CATEGORIES = {
  프레임워크: [
    "React",
    "Next.js",
    "Vue",
    "Nuxt.js",
    "Angular",
    "Svelte",
    "Remix",
    "Astro",
  ],
  언어: ["TypeScript", "JavaScript", "Python", "Java"],
  상태관리: ["Redux", "Zustand", "Recoil", "MobX", "Jotai", "Pinia", "Vuex"],
  스타일링: [
    "Tailwind CSS",
    "Styled-components",
    "Emotion",
    "SCSS",
    "CSS Modules",
  ],
  빌드도구: ["Vite", "Webpack", "Rollup", "Turbopack"],
  테스트: [
    "Jest",
    "Vitest",
    "Cypress",
    "Playwright",
    "Testing Library",
    "Storybook",
  ],
  데이터페칭: ["GraphQL", "React Query", "SWR", "Axios"],
  인프라: ["Git", "GitHub", "GitLab", "Docker", "AWS", "Vercel", "Figma"],
};
```

---

### 3. `/jobs` — 공고 탐색

**필터 (복수 선택 가능)**

- 기술 스택 멀티 셀렉트
- 출처 (Wanted / 잡코리아)
- 수집일 범위

**공고 카드 리스트**

- 회사명 / 공고 제목 / 출처 뱃지
- 기술 스택 뱃지 목록
- 원문 링크 버튼

**페이지네이션**: 20건씩

---

## 핵심 Supabase 쿼리

```sql
-- 1. 기술 스택 전체 빈도
SELECT tech, COUNT(*) AS cnt
FROM job_postings, unnest(tech_stacks) AS tech
GROUP BY tech
ORDER BY cnt DESC;

-- 2. 날짜별 · 출처별 공고 수
SELECT scraped_at, source, COUNT(*) AS cnt
FROM job_postings
GROUP BY scraped_at, source
ORDER BY scraped_at;

-- 3. 날짜별 · 기술별 등장 수 (트렌드용)
SELECT scraped_at, tech, COUNT(*) AS cnt
FROM job_postings, unnest(tech_stacks) AS tech
GROUP BY scraped_at, tech
ORDER BY scraped_at, cnt DESC;

-- 4. 기술 스택 필터 (복수)
SELECT * FROM job_postings
WHERE tech_stacks @> ARRAY['React', 'TypeScript']
ORDER BY scraped_at DESC;
```

> Supabase JS SDK에서 위 쿼리는 `supabase.rpc()` 또는 `supabase.from().select()`로 처리.
> unnest 집계는 Supabase DB Functions(PostgreSQL 함수)로 만들어서 `rpc()`로 호출 권장.

---

## 프로젝트 구조

```
jobs-scrap-dashboard/
├── app/
│   ├── layout.tsx
│   ├── page.tsx              # 홈
│   ├── trends/
│   │   └── page.tsx
│   └── jobs/
│       └── page.tsx
├── components/
│   ├── kpi-card.tsx
│   ├── tech-bar-chart.tsx
│   ├── collect-line-chart.tsx
│   ├── trend-line-chart.tsx
│   ├── tech-combo-table.tsx
│   └── job-card.tsx
├── lib/
│   ├── supabase.ts           # 클라이언트 초기화
│   └── queries.ts            # 쿼리 함수 모음
├── types/
│   └── job-posting.ts
└── .env.local
```

---

## Supabase DB Functions (사전 생성 필요)

대시보드 배포 전 Supabase SQL Editor에서 아래 함수를 생성하세요.

```sql
-- 기술 스택 빈도 집계
CREATE OR REPLACE FUNCTION get_tech_counts()
RETURNS TABLE(tech text, cnt bigint)
LANGUAGE sql STABLE AS $$
  SELECT t, COUNT(*) FROM job_postings, unnest(tech_stacks) t GROUP BY t ORDER BY COUNT(*) DESC;
$$;

-- 날짜별 기술 트렌드
CREATE OR REPLACE FUNCTION get_tech_trend()
RETURNS TABLE(scraped_at date, tech text, cnt bigint)
LANGUAGE sql STABLE AS $$
  SELECT scraped_at, t, COUNT(*)
  FROM job_postings, unnest(tech_stacks) t
  GROUP BY scraped_at, t
  ORDER BY scraped_at, COUNT(*) DESC;
$$;

-- 날짜별 출처별 공고 수
CREATE OR REPLACE FUNCTION get_daily_counts()
RETURNS TABLE(scraped_at date, source text, cnt bigint)
LANGUAGE sql STABLE AS $$
  SELECT scraped_at, source, COUNT(*)
  FROM job_postings
  GROUP BY scraped_at, source
  ORDER BY scraped_at;
$$;
```

---

## 구현 순서

1. `npx create-next-app@latest jobs-scrap-dashboard` (TypeScript + Tailwind 선택)
2. `@supabase/supabase-js`, `recharts` 설치
3. `.env.local`에 Supabase 연결 정보 입력
4. Supabase에 DB Functions 3개 생성
5. `lib/supabase.ts`, `lib/queries.ts` 구현
6. 홈 페이지부터 순서대로 구현
7. Vercel 배포 (GitHub 연결 후 환경변수 설정)
