import { useEffect, useState } from "react";
import type { JobPosting } from "@/types/job";

export interface DutiesKeyword {
  keyword: string;
  count: number;
  percent: number;
}

export function useDutiesStats(allData: JobPosting[]) {
  const [keywords, setKeywords] = useState<DutiesKeyword[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!allData.length) return;

    setLoading(true);
    setError(null);
    const duties = allData.flatMap((job) => job.duties);
    const totalItems = duties.length;

    fetch("/api/duties-stats", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ duties, totalItems }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setKeywords(data.keywords);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [allData]);

  return { keywords, loading, error };
}
