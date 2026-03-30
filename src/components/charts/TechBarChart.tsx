import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LabelList } from "recharts";
import { TECH_COLOR_MAP } from "@/constants/techCategories";

interface Props {
  data: { tech: string; count: number; percent: number }[];
}

export default function TechBarChart({ data }: Props) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">기술스택 요구 현황 (Top 15)</h3>
      <ResponsiveContainer width="100%" height={340}>
        <BarChart data={data} layout="vertical" margin={{ left: 60, right: 45 }}>
          <XAxis type="number" tick={{ fontSize: 11 }} />
          <YAxis type="category" dataKey="tech" tick={{ fontSize: 11 }} width={80} />
          <Tooltip
            formatter={(v, name, props) => [
              `${v}개 공고 (${props.payload.percent}%)`,
              "공고 수",
            ]}
          />
          <Bar dataKey="count" radius={[0, 4, 4, 0]}>
            {data.map((entry) => {
              const cls = TECH_COLOR_MAP[entry.tech];
              // Extract a hex-ish color from the tailwind class for recharts
              const colorMap: Record<string, string> = {
                "bg-blue-100": "#bfdbfe",
                "bg-purple-100": "#e9d5ff",
                "bg-pink-100": "#fce7f3",
                "bg-orange-100": "#ffedd5",
                "bg-yellow-100": "#fef9c3",
                "bg-green-100": "#dcfce7",
                "bg-gray-100": "#f3f4f6",
              };
              const bgClass = cls?.split(" ")[0] ?? "bg-blue-100";
              return <Cell key={entry.tech} fill={colorMap[bgClass] ?? "#bfdbfe"} />;
            })}
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
