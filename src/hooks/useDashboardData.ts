import { useEffect, useState } from "react";
import type { JobPosting } from "@/types/job";
import { normalizeTechStack } from "@/utils/techStack";

export function useDashboardData() {
  const [data, setData] = useState<JobPosting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((r) => r.json())
      .then((rows: JobPosting[]) => {
        setData(rows.map((row) => ({ ...row, tech_stacks: normalizeTechStack(row.tech_stacks) })));
      })
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}
