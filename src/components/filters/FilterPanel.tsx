import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { TECH_CATEGORIES } from "@/constants/techCategories";
import TechFilterGroup from "./TechFilterGroup";
import type { JobFilters } from "@/types/job";

interface Props {
  filters: JobFilters;
  setFilters: (f: JobFilters) => void;
}

const SOURCES = [
  { value: "jobkorea", label: "잡코리아" },
  { value: "wanted", label: "원티드" },
  { value: "saramin", label: "사람인" },
];

export default function FilterPanel({ filters, setFilters }: Props) {
  function setTechs(techs: string[]) {
    setFilters({ ...filters, techs });
  }

  function toggleSource(value: string) {
    const sources = filters.sources.includes(value)
      ? filters.sources.filter((s) => s !== value)
      : [...filters.sources, value];
    setFilters({ ...filters, sources });
  }

  const hasActiveFilters = filters.techs.length > 0 || filters.sources.length > 0 || filters.date !== "";

  return (
    <aside className="w-full lg:w-60 shrink-0 bg-white border-b lg:border-b-0 lg:border-r border-gray-200 p-4 overflow-y-auto max-h-80 sm:max-h-96 lg:max-h-none">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-gray-700">필터</h2>
        {hasActiveFilters && (
          <button
            onClick={() => setFilters({ ...filters, techs: [], sources: [], date: "" })}
            className="text-xs text-red-400 hover:text-red-600"
          >
            초기화
          </button>
        )}
      </div>

      <div className="mb-4">
        <p className="text-xs font-medium text-gray-500 mb-2">수집일</p>
        <DatePicker
          selected={filters.date ? new Date(filters.date) : null}
          onChange={(d: Date | null) => setFilters({ ...filters, date: d ? d.toISOString().slice(0, 10) : "" })}
          dateFormat="yyyy-MM-dd"
          placeholderText="날짜 선택"
          isClearable
          className="w-full text-xs border border-gray-300 rounded-lg px-2.5 py-1.5 text-gray-700 focus:outline-none focus:ring-1 focus:ring-indigo-400"
        />
      </div>

      <div className="mb-4">
        <p className="text-xs font-medium text-gray-500 mb-2">소스</p>
        <div className="flex flex-wrap gap-2">
          {SOURCES.map(({ value, label }) => {
            const active = filters.sources.includes(value);
            return (
              <button
                key={value}
                onClick={() => toggleSource(value)}
                className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                  active
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "bg-white text-gray-600 border-gray-300 hover:border-indigo-400"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
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
