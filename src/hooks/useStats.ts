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
    // always_recruit=true 이면 상시채용, career 값이 없고 always_recruit=false 이면 수집 전 데이터이므로 제외
    const careerCount: Record<string, number> = {};
    let careerTotal = 0;
    data.forEach((job) => {
      if (job.always_recruit) {
        careerCount["상시채용"] = (careerCount["상시채용"] ?? 0) + 1;
        careerTotal++;
      } else if (job.career?.trim()) {
        const label = job.career.trim();
        careerCount[label] = (careerCount[label] ?? 0) + 1;
        careerTotal++;
      }
      // always_recruit=false 이고 career 없음 → 경력 수집 전 데이터, 제외
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
