"use client";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";

const accuracyData = [
  { day: "Mon", acc: 88 }, { day: "Tue", acc: 91 }, { day: "Wed", acc: 89 },
  { day: "Thu", acc: 93 }, { day: "Fri", acc: 94 }, { day: "Sat", acc: 92 },
  { day: "Sun", acc: 96 },
];

const modelData = [
  { name: "XGBoost", score: 94 },
  { name: "RandomForest", score: 89 },
  { name: "LogReg", score: 82 },
  { name: "SVM", score: 85 },
];

const pieData = [
  { name: "Classification", value: 45 },
  { name: "Regression", value: 30 },
  { name: "Clustering", value: 25 },
];

const COLORS = ["#818cf8", "#22d3ee", "#34d399"];

const tooltipStyle = {
  backgroundColor: "#0d0d14",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "8px",
  color: "#e2e8f0",
  fontSize: "12px",
};

export default function DashboardCharts() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "16px" }}>
      {/* Line Chart */}
      <div style={{ backgroundColor: "#0d0d14", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "12px", padding: "20px" }}>
        <div style={{ fontSize: "13px", fontWeight: 600, color: "#94a3b8", marginBottom: "16px" }}>Model Accuracy Over Time</div>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={accuracyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="day" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis domain={[80, 100]} tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={tooltipStyle} />
            <Line type="monotone" dataKey="acc" stroke="#22d3ee" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Bar Chart */}
      <div style={{ backgroundColor: "#0d0d14", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "12px", padding: "20px" }}>
        <div style={{ fontSize: "13px", fontWeight: 600, color: "#94a3b8", marginBottom: "16px" }}>Model Comparison</div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={modelData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="name" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis domain={[70, 100]} tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={tooltipStyle} />
            <Bar dataKey="score" radius={[4, 4, 0, 0]}>
              {modelData.map((entry, i) => (
                <Cell key={i} fill={entry.name === "XGBoost" ? "#818cf8" : "rgba(129,140,248,0.35)"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Pie Chart */}
      <div style={{ backgroundColor: "#0d0d14", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "12px", padding: "20px" }}>
        <div style={{ fontSize: "13px", fontWeight: 600, color: "#94a3b8", marginBottom: "16px" }}>Task Distribution</div>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={3}>
              {pieData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
            </Pie>
            <Tooltip contentStyle={tooltipStyle} />
          </PieChart>
        </ResponsiveContainer>
        <div style={{ display: "flex", gap: "12px", justifyContent: "center", marginTop: "8px" }}>
          {pieData.map((d, i) => (
            <div key={d.name} style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", color: "#64748b" }}>
              <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: COLORS[i] }} />
              {d.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}