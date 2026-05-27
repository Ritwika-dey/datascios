"use client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface Props { results: any[]; bestModel: string; }

const tooltipStyle = { backgroundColor: "#0d0d14", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", color: "#e2e8f0", fontSize: "12px" };

export default function ModelLeaderboard({ results, bestModel }: Props) {
  const sorted = [...results].sort((a, b) => b.r2 - a.r2);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* R² Bar Chart */}
      <div style={{ backgroundColor: "#0d0d14", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "12px", padding: "20px" }}>
        <div style={{ fontSize: "13px", fontWeight: 600, color: "#94a3b8", marginBottom: "16px" }}>R² Score Comparison (higher = better)</div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={sorted} layout="vertical">
            <XAxis type="number" domain={[0, 1]} tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${(v * 100).toFixed(0)}%`} />
            <YAxis dataKey="model" type="category" width={140} tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={tooltipStyle} formatter={(v: any) => [`${(Number(v) * 100).toFixed(2)}%`, "R²"]} />
            <Bar dataKey="r2" radius={[0, 6, 6, 0]}>
              {sorted.map((r) => (
                <Cell key={r.model} fill={r.model === bestModel ? "#f472b6" : "rgba(244,114,182,0.3)"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Detailed table */}
      <div style={{ backgroundColor: "#0d0d14", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "12px", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              {["Rank", "Model", "R² Score", "MAE", "RMSE", "Train Time"].map(h => (
                <th key={h} style={{ padding: "14px 16px", textAlign: "left", fontSize: "11px", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((r, i) => {
              const isBest = r.model === bestModel;
              return (
                <tr key={r.model} style={{
                  borderBottom: "1px solid rgba(255,255,255,0.04)",
                  backgroundColor: isBest ? "rgba(244,114,182,0.04)" : "transparent",
                }}>
                  <td style={{ padding: "14px 16px", color: i === 0 ? "#f472b6" : "#64748b", fontWeight: 700 }}>
                    {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}
                  </td>
                  <td style={{ padding: "14px 16px", color: "#e2e8f0", fontWeight: isBest ? 700 : 400 }}>
                    {r.model}{isBest && <span style={{ marginLeft: "8px", fontSize: "10px", color: "#f472b6", border: "1px solid rgba(244,114,182,0.4)", borderRadius: "4px", padding: "1px 6px" }}>BEST</span>}
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <span style={{ color: r.r2 > 0.8 ? "#34d399" : r.r2 > 0.6 ? "#facc15" : "#f87171", fontWeight: 700 }}>
                      {(r.r2 * 100).toFixed(2)}%
                    </span>
                  </td>
                  <td style={{ padding: "14px 16px", color: "#94a3b8" }}>{r.mae.toLocaleString()}</td>
                  <td style={{ padding: "14px 16px", color: "#94a3b8" }}>{r.rmse.toLocaleString()}</td>
                  <td style={{ padding: "14px 16px", color: "#64748b", fontSize: "12px" }}>{r.train_time_sec}s</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}