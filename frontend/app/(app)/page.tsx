"use client";
import DashboardCharts from "@/components/charts/DashboardCharts";

const stats = [
  { label: "Datasets Uploaded", value: "12", delta: "+3", color: "#22d3ee" },
  { label: "Models Trained", value: "8", delta: "+1", color: "#818cf8" },
  { label: "Avg Accuracy", value: "94.2%", delta: "+2.1%", color: "#34d399" },
  { label: "Reports Generated", value: "5", delta: "+2", color: "#f472b6" },
];

export default function DashboardPage() {
  return (
    <div style={{ padding: "32px", maxWidth: "1400px" }}>
      {/* Header */}
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{
          margin: 0,
          fontSize: "28px",
          fontWeight: 700,
          background: "linear-gradient(90deg, #22d3ee, #818cf8)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}>
          Welcome back 👋
        </h1>
        <p style={{ margin: "6px 0 0", color: "#64748b", fontSize: "14px" }}>
          Your autonomous data scientist is ready.
        </p>
      </div>

      {/* Stat Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "32px" }}>
        {stats.map((s) => (
          <div key={s.label} style={{
            backgroundColor: "#0d0d14",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: "12px",
            padding: "20px",
            borderBottom: `2px solid ${s.color}`,
          }}>
            <div style={{ fontSize: "12px", color: "#64748b", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.05em" }}>{s.label}</div>
            <div style={{ fontSize: "28px", fontWeight: 700, color: "#e2e8f0" }}>{s.value}</div>
            <div style={{ fontSize: "12px", color: "#34d399", marginTop: "4px" }}>{s.delta} this week</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <DashboardCharts />
    </div>
  );
}