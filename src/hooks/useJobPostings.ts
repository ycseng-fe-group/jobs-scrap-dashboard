import { useEffect, useMemo, useState } from "react";
import type { JobPosting, JobFilters } from "@/types/job";
import { normalizeTechStack } from "@/utils/techStack";
import { normalizeCareer, careerFilterCategory } from "@/utils/career";

const today = new Date().toISOString().slice(0, 10);

const DEFAULT_FILTERS: JobFilters = {
  techs: [],
  sources: [],
  search: "",
  date: today,
  careers: [],
};

export function useJobPostings() {
  const [data, setData] = useState<JobPosting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<JobFilters>(DEFAULT_FILTERS);

  useEffect(() => {
    setLoading(true);
    setError(null);
    const url = filters.date
      ? `/api/job-postings?date=${filters.date}`
      : "/api/job-postings";
    fetch(url)
      .then((r) => r.json())
      .then((rows: JobPosting[]) => {
        setData(rows.map((row) => ({ ...row, tech_stacks: normalizeTechStack(row.tech_stacks) })));
      })
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, [filters.date]);

  const postings = useMemo(() => {
    return data.filter((job) => {
      if (filters.techs.length > 0) {
        const hasAll = filters.techs.every((t) => job.tech_stacks.includes(t));
        if (!hasAll) return false;
      }
      if (filters.sources.length > 0) {
        if (!filters.sources.includes(job.source)) return false;
      }
      if (filters.search.trim()) {
        const q = filters.search.toLowerCase();
        if (!job.title.toLowerCase().includes(q) && !job.company.toLowerCase().includes(q)) return false;
      }
      if (filters.careers.length > 0) {
        const label = job.always_recruit ? "상시채용" : normalizeCareer(job.career?.trim() ?? "");
        const category = careerFilterCategory(label);
        if (!filters.careers.includes(category)) return false;
      }
      return true;
    });
  }, [data, filters]);

  return { postings, loading, error, filters, setFilters, totalCount: data.length };
}
