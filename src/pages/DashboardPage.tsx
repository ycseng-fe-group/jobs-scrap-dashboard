import { useDashboardData } from "@/hooks/useDashboardData";
import { useDutiesStats } from "@/hooks/useDutiesStats";
import StatCardRow from "@/components/cards/StatCardRow";
import TechBarChart from "@/components/charts/TechBarChart";
import SourcePieChart from "@/components/charts/SourcePieChart";
import CareerBarChart from "@/components/charts/CareerBarChart";
import TechTrendChart from "@/components/charts/TechTrendChart";
import DutiesKeywordChart from "@/components/charts/DutiesKeywordChart";
import Spinner from "@/components/ui/Spinner";

export default function DashboardPage() {
  const { data, loading, error } = useDashboardData();
  const duties = useDutiesStats(data?.duties.sample ?? [], data?.duties.totalItems ?? 0);

  if (loading) return <Spinner />;
  if (error) return <div className="p-6 text-red-500">오류: {error}</div>;
  if (!data) return <div className="p-6 text-red-500">오류: 대시보드 데이터가 없습니다.</div>;

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <h2 className="text-xl font-bold text-gray-800">대시보드</h2>
      <StatCardRow
        totalActive={data.totalActive}
        totalCompanies={data.totalCompanies}
        todayCount={data.todayCount}
        topTech={data.topTechs[0]?.tech ?? "-"}
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <TechBarChart data={data.topTechs} />
        </div>
        <div>
          <SourcePieChart data={data.bySourceSite} />
        </div>
      </div>
      <TechTrendChart data={data.recentByDay} />
      <CareerBarChart data={data.careerStats} />
      <div>
        {duties.loading && (
          <div className="bg-white rounded-xl border border-gray-200 p-5 text-sm text-gray-500 text-center">
            AI가 주요업무 키워드를 분석 중입니다...
          </div>
        )}
        {duties.error && (
          <div className="bg-white rounded-xl border border-gray-200 p-5 text-sm text-red-500">
            키워드 분석 오류: {duties.error}
          </div>
        )}
        {!duties.loading && !duties.error && duties.keywords.length > 0 && (
          <DutiesKeywordChart data={duties.keywords} />
        )}
      </div>
    </div>
  );
}
