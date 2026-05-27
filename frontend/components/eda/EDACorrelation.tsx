"use client";

interface Props { data: any[]; columns: string[]; }

function getColor(value: number): string {
  // -1 = red, 0 = dark, +1 = cyan
  if (value >= 0) {
    const t = value;
    const r = Math.round(34 + (129 - 34) * (1 - t));
    const g = Math.round(211 + (140 - 211) * (1 - t));
    const b = Math.round(238 + (248 - 238) * (1 - t));
    return `rgb(${r},${g},${b})`;
  } else {
    const t = Math.abs(value);
    return `rgba(248,113,113,${0.15 + t * 0.85})`;
  }
}

export default function EDACorrelation({ data, columns }: Props) {
  const numericCols = [...new Set(data.map(d => d.x))];

  if (numericCols.length < 2) return (
    <div style={{ padding: "40px", textAlign: "center", color: "#64748b" }}>
      Need at least 2 numeric columns for correlation analysis.
    </div>
  );

  const getValue = (x: string, y: string) =>
    data.find(d => d.x === x && d.y === y)?.value ?? 0;

  return (
    <div style={{ backgroundColor: "#0d0d14", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "12px", padding: "24px" }}>
      <div style={{ fontSize: "13px", fontWeight: 600, color: "#94a3b8", marginBottom: "20px" }}>
        Pearson Correlation Matrix
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={{ borderCollapse: "collapse", minWidth: "100%" }}>
          <thead>
            <tr>
              <th style={{ padding: "8px", width: "120px" }} />
              {numericCols.map(col => (
                <th key={col} style={{
                  padding: "6px 4px", fontSize: "11px", color: "#64748b",
                  fontWeight: 500, textAlign: "center", maxWidth: "80px",
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                  fontFamily: "monospace",
                }}>
                  {col.length > 10 ? col.slice(0, 10) + "…" : col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {numericCols.map(rowCol => (
              <tr key={rowCol}>
                <td style={{
                  padding: "4px 8px", fontSize: "11px", color: "#64748b",
                  fontFamily: "monospace", textAlign: "right", whiteSpace: "nowrap",
                }}>
                  {rowCol.length > 14 ? rowCol.slice(0, 14) + "…" : rowCol}
                </td>
                {numericCols.map(colCol => {
                  const val = getValue(rowCol, colCol);
                  const bg = getColor(val);
                  const isDiag = rowCol === colCol;
                  return (
                    <td key={colCol} style={{
                      width: "60px", height: "48px", textAlign: "center",
                      backgroundColor: isDiag ? "rgba(255,255,255,0.08)" : bg,
                      fontSize: "11px", fontWeight: isDiag ? 700 : 500,
                      color: isDiag ? "#e2e8f0" : Math.abs(val) > 0.5 ? "#000" : "#e2e8f0",
                      border: "1px solid rgba(0,0,0,0.3)",
                      borderRadius: "4px",
                      transition: "transform 0.1s",
                      cursor: "default",
                    }}
                      title={`${rowCol} × ${colCol}: ${val}`}
                    >
                      {val.toFixed(2)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "20px" }}>
        <span style={{ fontSize: "11px", color: "#64748b" }}>−1</span>
        <div style={{ flex: 1, height: "8px", borderRadius: "4px", background: "linear-gradient(90deg, rgba(248,113,113,1), rgba(255,255,255,0.06), rgb(34,211,238))" }} />
        <span style={{ fontSize: "11px", color: "#64748b" }}>+1</span>
      </div>
    </div>
  );
}