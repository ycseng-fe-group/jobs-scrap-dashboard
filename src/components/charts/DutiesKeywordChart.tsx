import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LabelList } from "recharts";
import type { DutiesKeyword } from "@/hooks/useDutiesStats";

interface Props {
  data: DutiesKeyword[];
}

const COLORS = ["#60a5fa", "#818cf8", "#a78bfa", "#f472b6", "#fb923c", "#34d399"];

export default function DutiesKeywordChart({ data }: Props) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">주요업무 키워드 Top 20</h3>
      <ResponsiveContainer width="100%" height={420}>
        <BarChart data={data} layout="vertical" margin={{ left: 80, right: 60 }}>
          <XAxis type="number" tick={{ fontSize: 11 }} />
          <YAxis type="category" dataKey="keyword" tick={{ fontSize: 11 }} width={75} />
          <Tooltip
            formatter={(value, _, props) => [
              `${value}건 (${props.payload.percent}%)`,
              "빈도",
            ]}
          />
          <Bar dataKey="count" radius={[0, 4, 4, 0]}>
            <LabelList
              dataKey="percent"
              position="right"
              formatter={(v: number) => `${v}%`}
              style={{ fontSize: 11, fill: "#6b7280" }}
            />
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
