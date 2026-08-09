import { useEffect, useState } from "react";

export interface DashboardStats {
  totalActive: number;
  totalCompanies: number;
  todayCount: number;
  topTechs: { tech: string; count: number; percent: number }[];
  bySourceSite: { site: string; count: number }[];
  recentByDay: { date: string; count: number }[];
  careerStats: { career: string; count: number; percent: number }[];
  duties: { sample: string[]; totalItems: number };
}

export function useDashboardData() {
  const [data, setData] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/dashboard")
      .then(async (r) => {
        const body = await r.json();
        if (!r.ok) throw new Error(body.error ?? `HTTP ${r.status}`);
        return body as DashboardStats;
      })
      .then(setData)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}
