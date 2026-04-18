// 다양한 경력 표기를 정규화된 레이블로 통합
export function normalizeCareer(raw: string): string {
  if (/신입.{0,3}경력|경력.{0,3}신입/i.test(raw)) return "신입·경력";
  const yearMatch = raw.match(/경력\s*(\d+)\s*년/);
  if (yearMatch) return `경력 ${yearMatch[1]}년 이상`;
  return raw;
}

// 정규화된 경력 레이블 → 필터 카테고리 매핑
export function careerFilterCategory(label: string): string {
  if (label === "상시채용") return "상시채용";
  if (label === "신입·경력") return "신입·경력";
  if (/^신입$/.test(label)) return "신입";
  if (/경력무관/.test(label)) return "경력무관";
  if (/^경력/.test(label)) return "경력";
  return label;
}
