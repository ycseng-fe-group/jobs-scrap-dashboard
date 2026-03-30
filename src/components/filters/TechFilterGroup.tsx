import { useState } from "react";
import type { TechCategory } from "@/constants/techCategories";

interface Props {
  category: TechCategory;
  selected: string[];
  onChange: (techs: string[]) => void;
}

export default function TechFilterGroup({ category, selected, onChange }: Props) {
  const [open, setOpen] = useState(true);

  function toggle(tech: string) {
    if (selected.includes(tech)) {
      onChange(selected.filter((t) => t !== tech));
    } else {
      onChange([...selected, tech]);
    }
  }

  return (
    <div className="mb-4">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center justify-between w-full text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 hover:text-gray-700"
      >
        <span>{category.label}</span>
        <span>{open ? "▲" : "▼"}</span>
      </button>
      {open && (
        <div className="flex flex-wrap gap-1.5">
          {category.techs.map((tech) => {
            const active = selected.includes(tech);
            return (
              <button
                key={tech}
                onClick={() => toggle(tech)}
                className={`px-2 py-0.5 rounded text-xs font-medium transition-colors ${
                  active
                    ? category.color + " ring-2 ring-offset-1 ring-blue-400"
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                }`}
              >
                {tech}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
