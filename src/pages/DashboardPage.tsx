import { useJobPostingsContext as useJobPostings } from "@/context/JobPostingsContext";
import { useStats } from "@/hooks/useStats";
import StatCardRow from "@/components/cards/StatCardRow";
import TechBarChart from "@/components/charts/TechBarChart";
import SourcePieChart from "@/components/charts/SourcePieChart";
import TechTrendChart from "@/components/charts/TechTrendChart";
import Spinner from "@/components/ui/Spinner";

export default function DashboardPage() {
  const { allData, loading, error } = useJobPostings();
  const stats = useStats(allData);

  if (loading) return <Spinner />;
  if (error) return <div className="p-6 text-red-500">오류: {error}</div>;

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-bold text-gray-800">대시보드</h2>
      <StatCardRow
        totalActive={stats.totalActive}
        totalCompanies={stats.totalCompanies}
        todayCount={stats.todayCount}
        topTech={stats.topTechs[0]?.tech ?? "-"}
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <TechBarChart data={stats.topTechs} />
        </div>
        <div>
          <SourcePieChart data={stats.bySourceSite} />
        </div>
      </div>
      <TechTrendChart data={stats.recentByDay} />
    </div>
  );
}
