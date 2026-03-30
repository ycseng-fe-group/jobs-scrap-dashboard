import { TECH_COLOR_MAP } from "@/constants/techCategories";

export default function TechBadge({ tech }: { tech: string }) {
  const colorClass = TECH_COLOR_MAP[tech] ?? "bg-gray-100 text-gray-600";
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${colorClass}`}>
      {tech}
    </span>
  );
}
