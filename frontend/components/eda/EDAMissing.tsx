"use client";

interface Props { data: any[]; totalRows: number; }

export default function EDAMissing({ data, totalRows }: Props) {
  const withMissing = data.filter(d => d.missing > 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      {data.length === 0 && (
        <div style={{ padding: "40px", textAlign: "center", color: "#64748b" }}>No columns found.</div>
      )}
      {withMissing.length === 0 && data.length > 0 && (
        <div style={{
          padding: "20px", backgroundColor: "rgba(52,211,153,0.08)",
          border: "1px solid rgba(52,211,153,0.2)", borderRadius: "10px",
          color: "#34d399", fontSize: "14px",
        }}>
          ✓ No missing values found. Your dataset is complete.
        </div>
      )}

      {data.map(col => (
        <div key={col.column} style={{
          backgroundColor: "#0d0d14", border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: "10px", padding: "16px",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontFamily: "monospace", fontSize: "13px", color: "#e2e8f0" }}>{col.column}</span>
              <span style={{ fontSize: "11px", color: "#64748b", backgroundColor: "rgba(255,255,255,0.04)", padding: "2px 8px", borderRadius: "4px" }}>{col.dtype}</span>
            </div>
            <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
              <span style={{ fontSize: "13px", color: col.missing > 0 ? "#f87171" : "#34d399" }}>
                {col.missing} missing
              </span>
              <span style={{ fontSize: "12px", color: "#64748b" }}>{col.pct}%</span>
            </div>
          </div>
          {/* Progress bar */}
          <div style={{ height: "6px", backgroundColor: "rgba(255,255,255,0.06)", borderRadius: "3px", overflow: "hidden" }}>
            <div style={{
              width: `${col.pct}%`, height: "100%", borderRadius: "3px",
              backgroundColor: col.pct > 50 ? "#f87171" : col.pct > 20 ? "#fb923c" : col.pct > 0 ? "#facc15" : "#34d399",
              transition: "width 0.5s ease",
            }} />
          </div>
        </div>
      ))}
    </div>
  );
}