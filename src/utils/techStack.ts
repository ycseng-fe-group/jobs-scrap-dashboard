import { TECH_ALIASES } from "@/constants/techCategories";

export function normalizeTechStack(raw: unknown): string[] {
  let arr: string[];
  if (Array.isArray(raw)) {
    arr = raw as string[];
  } else if (typeof raw === "string") {
    try {
      arr = JSON.parse(raw);
    } catch {
      arr = [raw];
    }
  } else {
    return [];
  }
  return arr.map((t) => {
    const lower = t.toLowerCase().trim();
    return TECH_ALIASES[lower] ?? t.trim();
  });
}
