import { useMemo } from "react";
import type { JobPosting } from "@/types/job";

export function useStats(data: JobPosting[]) {
  return useMemo(() => {
    const totalActive = data.length;

    const companies = new Set(data.map((j) => j.company));
    const totalCompanies = companies.size;

    const today = new Date().toISOString().slice(0, 10);
    const todayCount = data.filter((j) => j.scraped_at?.slice(0, 10) === today).length;

    // Top techs
    const techCount: Record<string, number> = {};
    data.forEach((job) => {
      job.tech_stack.forEach((t) => {
        techCount[t] = (techCount[t] ?? 0) + 1;
      });
    });
    const topTechs = Object.entries(techCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 15)
      .map(([tech, count]) => ({ tech, count }));

    // By source site
    const sourceCount: Record<string, number> = {};
    data.forEach((job) => {
      const s = job.source_site ?? "기타";
      sourceCount[s] = (sourceCount[s] ?? 0) + 1;
    });
    const bySourceSite = Object.entries(sourceCount)
      .sort((a, b) => b[1] - a[1])
      .map(([site, count]) => ({ site, count }));

    // Last 30 days trend
    const last30 = Array.from({ length: 30 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (29 - i));
      return d.toISOString().slice(0, 10);
    });
    const byDay: Record<string, number> = {};
    data.forEach((job) => {
      const day = job.scraped_at?.slice(0, 10);
      if (day) byDay[day] = (byDay[day] ?? 0) + 1;
    });
    const recentByDay = last30.map((date) => ({ date, count: byDay[date] ?? 0 }));

    // By employment type
    const typeCount: Record<string, number> = {};
    data.forEach((job) => {
      const t = job.employment_type ?? "미분류";
      typeCount[t] = (typeCount[t] ?? 0) + 1;
    });
    const byEmploymentType = Object.entries(typeCount)
      .sort((a, b) => b[1] - a[1])
      .map(([type, count]) => ({ type, count }));

    return { totalActive, totalCompanies, todayCount, topTechs, bySourceSite, recentByDay, byEmploymentType };
  }, [data]);
}
