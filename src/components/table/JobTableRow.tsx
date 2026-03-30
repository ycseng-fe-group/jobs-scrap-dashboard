import type { JobPosting } from "@/types/job";
import TechBadge from "./TechBadge";
import Badge from "@/components/ui/Badge";

export default function JobTableRow({ job }: { job: JobPosting }) {
  const visibleTechs = job.tech_stack.slice(0, 4);
  const hiddenCount = job.tech_stack.length - visibleTechs.length;
  const dateStr = job.scraped_at
    ? new Intl.DateTimeFormat("ko-KR", { month: "2-digit", day: "2-digit" }).format(new Date(job.scraped_at))
    : "-";

  return (
    <tr className="hover:bg-gray-50 border-b border-gray-100">
      <td className="py-3 px-4 text-sm font-medium text-gray-900 max-w-[200px] truncate">{job.company}</td>
      <td className="py-3 px-4">
        <a
          href={job.source_url}
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
            <span className="text-xs text-gray-400 self-center">+{hiddenCount}</span>
          )}
        </div>
      </td>
      <td className="py-3 px-4 text-sm text-gray-500 whitespace-nowrap">{job.experience ?? "-"}</td>
      <td className="py-3 px-4">
        {job.employment_type && (
          <Badge>{job.employment_type}</Badge>
        )}
      </td>
      <td className="py-3 px-4 text-sm text-gray-400 whitespace-nowrap">{dateStr}</td>
      <td className="py-3 px-4 text-sm text-gray-400">{job.source_site ?? "-"}</td>
    </tr>
  );
}
