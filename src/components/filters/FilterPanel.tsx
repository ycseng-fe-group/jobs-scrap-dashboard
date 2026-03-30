import { TECH_CATEGORIES } from "@/constants/techCategories";
import TechFilterGroup from "./TechFilterGroup";
import type { JobFilters } from "@/types/job";

interface Props {
  filters: JobFilters;
  setFilters: (f: JobFilters) => void;
}

export default function FilterPanel({ filters, setFilters }: Props) {
  function setTechs(techs: string[]) {
    setFilters({ ...filters, techs });
  }

  return (
    <aside className="w-full lg:w-60 shrink-0 bg-white border-b lg:border-b-0 lg:border-r border-gray-200 p-4 overflow-y-auto max-h-80 sm:max-h-96 lg:max-h-none">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-gray-700">필터</h2>
        {filters.techs.length > 0 && (
          <button
            onClick={() => setTechs([])}
            className="text-xs text-red-400 hover:text-red-600"
          >
            초기화
          </button>
        )}
      </div>
      {TECH_CATEGORIES.map((cat) => (
        <TechFilterGroup
          key={cat.label}
          category={cat}
          selected={filters.techs}
          onChange={setTechs}
        />
      ))}
    </aside>
  );
}
