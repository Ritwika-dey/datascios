"use client";
import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface Props { results: any[]; bestModel: string; }

const COLORS = ["#f472b6", "#818cf8", "#22d3ee", "#34d399", "#fb923c", "#facc15"];
const tooltipStyle = { backgroundColor: "#0d0d14", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", color: "#e2e8f0", fontSize: "12px" };

export default function FeatureImportance({ results, bestModel }: Props) {
  const [selectedModel, setSelectedModel] = useState(bestModel);
  const model = results.find(r => r.model === selectedModel);
  const data = model?.feature_importance || [];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* Model selector */}
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        {results.map(r => (
          <button key={r.model} onClick={() => setSelectedModel(r.model)} style={{
            padding: "7px 16px", borderRadius: "7px", fontSize: "12px", fontWeight: 600,
            border: "none", cursor: "pointer",
            backgroundColor: selectedModel === r.model ? "#818cf8" : "rgba(255,255,255,0.04)",
            color: selectedModel === r.model ? "#000" : "#94a3b8",
          }}>{r.model}</button>
        ))}
      </div>

      <div style={{ backgroundColor: "#0d0d14", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "12px", padding: "20px" }}>
        <div style={{ fontSize: "13px", fontWeight: 600, color: "#94a3b8", marginBottom: "16px" }}>
          Top Features — {selectedModel}
        </div>
        {data.length === 0 ? (
          <div style={{ color: "#64748b", fontSize: "14px", padding: "20px 0" }}>
            Feature importance not available for this model type.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={Math.max(data.length * 36, 200)}>
            <BarChart data={data} layout="vertical">
              <XAxis type="number" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis dataKey="feature" type="category" width={130} tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v: any) => [Number(v).toFixed(4), "Importance"]} />
              <Bar dataKey="importance" radius={[0, 6, 6, 0]}>
                {data.map((_: any, i: number) => <Cell key={i} fill={COLORS[i % COLORS.length]} opacity={1 - i * 0.04} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}