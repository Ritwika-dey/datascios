"use client";
import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface Props { data: any[]; }

const tooltipStyle = {
  backgroundColor: "#0d0d14", border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "8px", color: "#e2e8f0", fontSize: "12px",
};

export default function EDANumeric({ data }: Props) {
  const [selected, setSelected] = useState<string>(data[0]?.column || "");
  const col = data.find(d => d.column === selected);

  if (data.length === 0) return (
    <div style={{ padding: "40px", textAlign: "center", color: "#64748b" }}>No numeric columns found.</div>
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
            backgroundColor: selected === d.column ? "rgba(129,140,248,0.15)" : "transparent",
            color: selected === d.column ? "#818cf8" : "#94a3b8",
            fontSize: "13px", fontFamily: "monospace", marginBottom: "2px",
          }}>{d.column}</button>
        ))}
      </div>

      {/* Stats panel */}
      {col && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Stat chips */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "10px" }}>
            {[
              { label: "Mean", value: col.mean, color: "#22d3ee" },
              { label: "Median", value: col.median, color: "#818cf8" },
              { label: "Std Dev", value: col.std, color: "#f472b6" },
              { label: "Min", value: col.min, color: "#34d399" },
              { label: "Max", value: col.max, color: "#fb923c" },
              { label: "Q1", value: col.q1, color: "#facc15" },
              { label: "Q3", value: col.q3, color: "#facc15" },
              { label: "Skewness", value: col.skewness, color: col.skewness > 1 || col.skewness < -1 ? "#f87171" : "#34d399" },
              { label: "Kurtosis", value: col.kurtosis, color: "#94a3b8" },
              { label: "Outliers", value: col.outliers, color: col.outliers > 0 ? "#f87171" : "#34d399" },
            ].map(s => (
              <div key={s.label} style={{
                backgroundColor: "#0d0d14", border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: "10px", padding: "14px", borderBottom: `2px solid ${s.color}`,
              }}>
                <div style={{ fontSize: "10px", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>{s.label}</div>
                <div style={{ fontSize: "18px", fontWeight: 700, color: "#e2e8f0", marginTop: "4px" }}>{s.value}</div>
              </div>
            ))}
          </div>

          {/* Histogram */}
          <div style={{
            backgroundColor: "#0d0d14", border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: "12px", padding: "20px",
          }}>
            <div style={{ fontSize: "13px", fontWeight: 600, color: "#94a3b8", marginBottom: "16px" }}>
              Distribution — {col.column}
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={col.histogram} barCategoryGap="2%">
                <XAxis dataKey="x" tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="count" fill="#818cf8" radius={[2, 2, 0, 0]} opacity={0.85} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}