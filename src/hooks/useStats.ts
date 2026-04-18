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
      job.tech_stacks.forEach((t) => {
        techCount[t] = (techCount[t] ?? 0) + 1;
      });
    });
    const topTechs = Object.entries(techCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 15)
      .map(([tech, count]) => ({
        tech,
        count,
        percent: totalActive > 0 ? Math.round((count / totalActive) * 100) : 0,
      }));

    // By source site
    const sourceCount: Record<string, number> = {};
    data.forEach((job) => {
      const s = job.source ?? "기타";
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

    // Career distribution
    // 2026-04-16 이전 데이터는 경력 정보를 수집하지 않았으므로 집계에서 제외
    const CAREER_COLLECTION_START = "2026-04-16";
    const careerCount: Record<string, number> = {};
    let careerTotal = 0;
    data.forEach((job) => {
      const scrapedDate = job.scraped_at?.slice(0, 10) ?? "";
      if (scrapedDate < CAREER_COLLECTION_START) return;
      const label = job.career?.trim() || "상시채용";
      careerCount[label] = (careerCount[label] ?? 0) + 1;
      careerTotal++;
    });
    const careerStats = Object.entries(careerCount)
      .sort((a, b) => b[1] - a[1])
      .map(([career, count]) => ({
        career,
        count,
        percent: careerTotal > 0 ? Math.round((count / careerTotal) * 100) : 0,
      }));

    return { totalActive, totalCompanies, todayCount, topTechs, bySourceSite, recentByDay, careerStats };
  }, [data]);
}
