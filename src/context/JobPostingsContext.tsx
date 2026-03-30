import { createContext, useContext } from "react";
import { useJobPostings } from "@/hooks/useJobPostings";
import type { JobPosting, JobFilters } from "@/types/job";

interface JobPostingsContextValue {
  postings: JobPosting[];
  allData: JobPosting[];
  loading: boolean;
  error: string | null;
  filters: JobFilters;
  setFilters: (f: JobFilters) => void;
  totalCount: number;
}

const JobPostingsContext = createContext<JobPostingsContextValue | null>(null);

export function JobPostingsProvider({ children }: { children: React.ReactNode }) {
  const value = useJobPostings();
  return <JobPostingsContext.Provider value={value}>{children}</JobPostingsContext.Provider>;
}

export function useJobPostingsContext() {
  const ctx = useContext(JobPostingsContext);
  if (!ctx) throw new Error("useJobPostingsContext must be used within JobPostingsProvider");
  return ctx;
}
