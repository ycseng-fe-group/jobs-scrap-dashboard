import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LabelList } from "recharts";

const COLORS = ["#bfdbfe", "#e9d5ff", "#fce7f3", "#ffedd5", "#dcfce7", "#fef9c3", "#f3f4f6"];

interface Props {
  data: { career: string; count: number; percent: number }[];
}

export default function CareerBarChart({ data }: Props) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">경력 별 공고 분포</h3>
      <ResponsiveContainer width="100%" height={Math.max(160, data.length * 36 + 20)}>
        <BarChart data={data} layout="vertical" margin={{ left: 60, right: 45 }}>
          <XAxis type="number" tick={{ fontSize: 11 }} />
          <YAxis type="category" dataKey="career" tick={{ fontSize: 11 }} width={80} />
          <Tooltip formatter={(v, _, props) => [`${v}개 공고 (${props.payload.percent}%)`, "공고 수"]} />
          <Bar dataKey="count" radius={[0, 4, 4, 0]}>
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
            <LabelList
              dataKey="percent"
              position="right"
              formatter={(v: number) => `${v}%`}
              style={{ fontSize: 11, fill: "#6b7280" }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
