import { useState } from "react";
import type { JobPosting } from "@/types/job";
import TechBadge from "./TechBadge";

const SOURCE_LABEL: Record<string, string> = {
  wanted: "원티드",
  jobkorea: "잡코리아",
  saramin: "사람인",
};

function formatDeadline(job: JobPosting): string {
  if (job.always_recruit) return "상시채용";
  if (job.end_at) {
    return new Intl.DateTimeFormat("ko-KR", { month: "2-digit", day: "2-digit" }).format(new Date(job.end_at));
  }
  return "-";
}

export default function JobTableRow({ job }: { job: JobPosting }) {
  const [expanded, setExpanded] = useState(false);
  const visibleTechs = expanded ? job.tech_stacks : job.tech_stacks.slice(0, 4);
  const hiddenCount = job.tech_stacks.length - 4;
  const scrapedStr = job.scraped_at
    ? new Intl.DateTimeFormat("ko-KR", { month: "2-digit", day: "2-digit" }).format(new Date(job.scraped_at))
    : "-";

  return (
    <tr className="hover:bg-gray-50 border-b border-gray-100">
      <td className="py-3 px-4 text-sm font-medium text-gray-900 max-w-[200px] truncate">{job.company}</td>
      <td className="py-3 px-4">
        <a
          href={job.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-600 hover:underline line-clamp-2"
        >
          {job.title}
        </a>
      </td>
      <td className="py-3 px-4">
        <div className="flex flex-wrap gap-1">
          {visibleTechs.map((t) => (
            <TechBadge key={t} tech={t} />
          ))}
          {hiddenCount > 0 && (
            <button
              onClick={() => setExpanded((v) => !v)}
              className="text-xs text-blue-500 hover:text-blue-700 self-center px-1"
            >
              {expanded ? "접기" : `+${hiddenCount}`}
            </button>
          )}
        </div>
      </td>
      <td className="py-3 px-4 text-sm text-gray-500 whitespace-nowrap">{job.career || "-"}</td>
      <td className="py-3 px-4 text-sm text-gray-400 whitespace-nowrap">{scrapedStr}</td>
      <td className="py-3 px-4 text-sm text-gray-400 whitespace-nowrap">{formatDeadline(job)}</td>
      <td className="py-3 px-4 text-sm text-gray-400">{SOURCE_LABEL[job.source] ?? job.source}</td>
    </tr>
  );
}
