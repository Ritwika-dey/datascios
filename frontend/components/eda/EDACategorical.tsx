"use client";
import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface Props { data: any[]; }

const COLORS = ["#818cf8", "#22d3ee", "#34d399", "#f472b6", "#fb923c", "#facc15", "#a78bfa", "#38bdf8", "#4ade80", "#f87171"];
const tooltipStyle = { backgroundColor: "#0d0d14", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", color: "#e2e8f0", fontSize: "12px" };

export default function EDACategorical({ data }: Props) {
  const [selected, setSelected] = useState<string>(data[0]?.column || "");
  const col = data.find(d => d.column === selected);

  if (data.length === 0) return (
    <div style={{ padding: "40px", textAlign: "center", color: "#64748b" }}>No categorical columns found.</div>
  );

  return (
    <div style={{ display: "flex", gap: "16px" }}>
      {/* Column list */}
      <div style={{
        width: "200px", minWidth: "200px", backgroundColor: "#0d0d14",
        border: "1px solid rgba(255,255,255,0.06)", borderRadius: "12px",
        padding: "12px", height: "fit-content",
      }}>
        <div style={{ fontSize: "11px", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "10px", padding: "0 4px" }}>Columns</div>
        {data.map(d => (
          <button key={d.column} onClick={() => setSelected(d.column)} style={{
            display: "block", width: "100%", textAlign: "left",
            padding: "8px 10px", borderRadius: "6px", border: "none", cursor: "pointer",
            backgroundColor: selected === d.column ? "rgba(52,211,153,0.15)" : "transparent",
            color: selected === d.column ? "#34d399" : "#94a3b8",
            fontSize: "13px", fontFamily: "monospace", marginBottom: "2px",
          }}>{d.column}</button>
        ))}
      </div>

      {col && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Summary chips */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
            {[
              { label: "Unique Values", value: col.unique, color: "#34d399" },
              { label: "Top Value", value: col.top_value, color: "#22d3ee" },
              { label: "Top Count", value: col.top_count, color: "#f472b6" },
            ].map(s => (
              <div key={s.label} style={{
                backgroundColor: "#0d0d14", border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: "10px", padding: "16px", borderBottom: `2px solid ${s.color}`,
              }}>
                <div style={{ fontSize: "10px", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>{s.label}</div>
                <div style={{ fontSize: "18px", fontWeight: 700, color: "#e2e8f0", marginTop: "4px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.value}</div>
              </div>
            ))}
          </div>

          {/* Bar chart of top values */}
          <div style={{ backgroundColor: "#0d0d14", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "12px", padding: "20px" }}>
            <div style={{ fontSize: "13px", fontWeight: 600, color: "#94a3b8", marginBottom: "16px" }}>Top Values — {col.column}</div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={col.top_values} layout="vertical">
                <XAxis type="number" tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis dataKey="value" type="category" width={120} tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v: any, n: any, p: any) => [`${v} (${p.payload.pct}%)`, "count"]} />
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {col.top_values.map((_: any, i: number) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}