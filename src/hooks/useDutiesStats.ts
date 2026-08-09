import { useEffect, useState } from "react";
export interface DutiesKeyword {
  keyword: string;
  count: number;
  percent: number;
}

export function useDutiesStats(duties: string[], totalItems: number) {
  const [keywords, setKeywords] = useState<DutiesKeyword[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!duties.length) return;

    setLoading(true);
    setError(null);
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
  }, [duties, totalItems]);

  return { keywords, loading, error };
}
