import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = ["#3b82f6", "#8b5cf6", "#ec4899", "#f97316", "#22c55e", "#6b7280"];

interface Props {
  data: { site: string; count: number }[];
}

export default function SourcePieChart({ data }: Props) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">소스 별 공고 분포</h3>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie data={data} dataKey="count" nameKey="site" cx="50%" cy="50%" outerRadius={80} label={({ site, percent }) => `${site} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(v) => [`${v}개`, "공고 수"]} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
