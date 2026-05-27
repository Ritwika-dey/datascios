"use client";

interface Props { data: any; }

const card = (label: string, value: any, color: string, sub?: string) => (
  <div key={label} style={{
    backgroundColor: "#0d0d14", border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: "12px", padding: "20px", borderBottom: `2px solid ${color}`,
  }}>
    <div style={{ fontSize: "11px", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px" }}>{label}</div>
    <div style={{ fontSize: "26px", fontWeight: 700, color: "#e2e8f0" }}>{value?.toLocaleString?.() ?? value}</div>
    {sub && <div style={{ fontSize: "11px", color: "#64748b", marginTop: "4px" }}>{sub}</div>}
  </div>
);

export default function EDAOverview({ data }: Props) {
  if (!data) return null;
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "16px", marginBottom: "24px" }}>
        {card("Rows", data.rows, "#22d3ee")}
        {card("Columns", data.columns, "#818cf8")}
        {card("Numeric Cols", data.numeric_columns, "#34d399")}
        {card("Categorical Cols", data.categorical_columns, "#f472b6")}
        {card("Missing Values", data.total_missing, data.total_missing > 0 ? "#f87171" : "#34d399", data.total_missing > 0 ? "needs attention" : "clean")}
        {card("Duplicate Rows", data.duplicate_rows, data.duplicate_rows > 0 ? "#fb923c" : "#34d399")}
        {card("Memory", `${data.memory_usage_kb} KB`, "#facc15")}
      </div>

      {/* Column list */}
      <div style={{
        backgroundColor: "#0d0d14", border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: "12px", padding: "20px",
      }}>
        <div style={{ fontSize: "13px", fontWeight: 600, color: "#94a3b8", marginBottom: "14px" }}>All Columns</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {data.column_names?.map((col: string) => (
            <span key={col} style={{
              padding: "4px 10px", backgroundColor: "rgba(129,140,248,0.1)",
              border: "1px solid rgba(129,140,248,0.2)", borderRadius: "6px",
              fontSize: "12px", color: "#818cf8", fontFamily: "monospace",
            }}>{col}</span>
          ))}
        </div>
      </div>
    </div>
  );
}