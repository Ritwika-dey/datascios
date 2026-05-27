"use client";
import { ScatterChart, Scatter, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";

interface Props { data: any[]; targetCol: string; }

const tooltipStyle = { backgroundColor: "#0d0d14", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", color: "#e2e8f0", fontSize: "12px" };

export default function ActualVsPredicted({ data, targetCol }: Props) {
  const min = Math.min(...data.map(d => Math.min(d.actual, d.predicted)));
  const max = Math.max(...data.map(d => Math.max(d.actual, d.predicted)));

  return (
    <div style={{ backgroundColor: "#0d0d14", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "12px", padding: "20px" }}>
      <div style={{ fontSize: "13px", fontWeight: 600, color: "#94a3b8", marginBottom: "4px" }}>
        Actual vs Predicted — {targetCol}
      </div>
      <div style={{ fontSize: "12px", color: "#475569", marginBottom: "16px" }}>
        Points on the diagonal line = perfect predictions. Sample of 200 test rows.
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <ScatterChart>
          <XAxis
            dataKey="actual" name="Actual" type="number"
            domain={[min * 0.9, max * 1.1]}
            tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false}
            label={{ value: "Actual", position: "insideBottom", offset: -4, fill: "#64748b", fontSize: 12 }}
          />
          <YAxis
            dataKey="predicted" name="Predicted" type="number"
            domain={[min * 0.9, max * 1.1]}
            tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false}
            label={{ value: "Predicted", angle: -90, position: "insideLeft", fill: "#64748b", fontSize: 12 }}
          />
          <Tooltip
            contentStyle={tooltipStyle}
            cursor={{ strokeDasharray: "3 3", stroke: "rgba(255,255,255,0.1)" }}
            formatter={(v: any, n: any) => [Number(v).toLocaleString(), n]}
          />
          {/* Perfect prediction line */}
          <ReferenceLine
            segment={[{ x: min * 0.9, y: min * 0.9 }, { x: max * 1.1, y: max * 1.1 }]}
            stroke="rgba(52,211,153,0.4)" strokeDasharray="6 3" strokeWidth={1.5}
          />
          <Scatter data={data} fill="#818cf8" opacity={0.6} />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}