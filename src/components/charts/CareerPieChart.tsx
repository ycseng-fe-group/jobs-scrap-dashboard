import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ["#6b7280", "#3b82f6", "#22c55e", "#f97316", "#8b5cf6", "#ec4899", "#14b8a6"];

interface Props {
  data: { career: string; count: number }[];
}

export default function CareerPieChart({ data }: Props) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">경력 별 공고 분포</h3>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={data}
            dataKey="count"
            nameKey="career"
            cx="50%"
            cy="50%"
            outerRadius={80}
            label={({ career, percent }) => `${career} ${(percent * 100).toFixed(0)}%`}
            labelLine={false}
          >
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
