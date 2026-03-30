import { useState } from "react";
import type { JobPosting } from "@/types/job";
import JobTableRow from "./JobTableRow";
import Pagination from "./Pagination";
import EmptyState from "@/components/ui/EmptyState";

const PAGE_SIZE = 20;

type SortKey = "scraped_at" | "company" | "title";

export default function JobTable({ postings }: { postings: JobPosting[] }) {
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState<SortKey>("scraped_at");
  const [sortAsc, setSortAsc] = useState(false);

  const sorted = [...postings].sort((a, b) => {
    const va = a[sortKey] ?? "";
    const vb = b[sortKey] ?? "";
    return sortAsc ? va.localeCompare(vb) : vb.localeCompare(va);
  });

  const totalPages = Math.ceil(sorted.length / PAGE_SIZE);
  const pageItems = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortAsc((v) => !v);
    else { setSortKey(key); setSortAsc(false); }
    setPage(1);
  }

  const thClass = (key: SortKey) =>
    `py-2 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide cursor-pointer hover:text-gray-800 select-none ${sortKey === key ? "text-blue-600" : ""}`;

  if (postings.length === 0) return <EmptyState message="조건에 맞는 공고가 없습니다." />;

  return (
    <div>
      <div className="text-sm text-gray-500 mb-2">총 {postings.length}개 공고</div>
      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className={thClass("company")} onClick={() => toggleSort("company")}>회사</th>
              <th className={thClass("title")} onClick={() => toggleSort("title")}>공고명</th>
              <th className="py-2 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">기술스택</th>
              <th className={thClass("scraped_at")} onClick={() => toggleSort("scraped_at")}>수집일</th>
              <th className="py-2 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">소스</th>
            </tr>
          </thead>
          <tbody>
            {pageItems.map((job) => (
              <JobTableRow key={job.id} job={job} />
            ))}
          </tbody>
        </table>
      </div>
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
