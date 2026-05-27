"use client";

interface Props { data: Record<string, string>[]; }

export default function EDASample({ data }: Props) {
  if (!data || data.length === 0) return (
    <div style={{ padding: "40px", textAlign: "center", color: "#64748b" }}>No sample data.</div>
  );

  const columns = Object.keys(data[0]);

  return (
    <div style={{ backgroundColor: "#0d0d14", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "12px", padding: "20px", overflowX: "auto" }}>
      <div style={{ fontSize: "13px", fontWeight: 600, color: "#94a3b8", marginBottom: "16px" }}>First 5 Rows</div>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
        <thead>
          <tr>
            {columns.map(col => (
              <th key={col} style={{
                padding: "10px 12px", textAlign: "left", fontFamily: "monospace",
                fontSize: "11px", color: "#818cf8", fontWeight: 600,
                borderBottom: "1px solid rgba(255,255,255,0.06)", whiteSpace: "nowrap",
              }}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i} style={{ backgroundColor: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.02)" }}>
              {columns.map(col => (
                <td key={col} style={{
                  padding: "10px 12px", color: "#94a3b8", fontSize: "13px",
                  borderBottom: "1px solid rgba(255,255,255,0.03)", whiteSpace: "nowrap",
                  maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis",
                }}>{row[col]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}