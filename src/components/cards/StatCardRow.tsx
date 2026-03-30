import StatCard from "./StatCard";

interface Props {
  totalActive: number;
  totalCompanies: number;
  todayCount: number;
  topTech: string;
}

export default function StatCardRow({ totalActive, totalCompanies, todayCount, topTech }: Props) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard label="전체 공고" value={totalActive.toLocaleString()} sub="활성 공고 수" />
      <StatCard label="기업 수" value={totalCompanies.toLocaleString()} sub="채용 중인 기업" color="text-purple-600" />
      <StatCard label="오늘 수집" value={todayCount.toLocaleString()} sub="today" color="text-green-600" />
      <StatCard label="인기 기술" value={topTech || "-"} sub="가장 많이 요구되는 기술" color="text-orange-600" />
    </div>
  );
}
