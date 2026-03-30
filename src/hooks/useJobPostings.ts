import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { JobPosting, JobFilters } from "@/types/job";
import { TECH_ALIASES } from "@/constants/techCategories";

function normalizeTechStack(raw: unknown): string[] {
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

const DEFAULT_FILTERS: JobFilters = {
  techs: [],
  sources: [],
  employmentTypes: [],
  search: "",
};

export function useJobPostings() {
  const [data, setData] = useState<JobPosting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<JobFilters>(DEFAULT_FILTERS);

  useEffect(() => {
    setLoading(true);
    supabase
      .from("job_postings")
      .select("*")
      .order("scraped_at", { ascending: false })
      .then(({ data: rows, error: err }) => {
        if (err) {
          setError(err.message);
        } else {
          const normalized = (rows ?? []).map((row) => ({
            ...row,
            tech_stack: normalizeTechStack(row.tech_stack),
          })) as JobPosting[];
          setData(normalized);
        }
        setLoading(false);
      });
  }, []);

  const postings = useMemo(() => {
    return data.filter((job) => {
      if (filters.techs.length > 0) {
        const hasAll = filters.techs.every((t) => job.tech_stack.includes(t));
        if (!hasAll) return false;
      }
      if (filters.sources.length > 0) {
        if (!job.source_site || !filters.sources.includes(job.source_site)) return false;
      }
      if (filters.employmentTypes.length > 0) {
        if (!job.employment_type || !filters.employmentTypes.includes(job.employment_type)) return false;
      }
      if (filters.search.trim()) {
        const q = filters.search.toLowerCase();
        if (!job.title.toLowerCase().includes(q) && !job.company.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [data, filters]);

  return { postings, allData: data, loading, error, filters, setFilters, totalCount: data.length };
}
