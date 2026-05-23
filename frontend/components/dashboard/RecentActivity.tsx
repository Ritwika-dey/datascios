"use client";

import { Database, Cpu, LineChart, MessageSquare } from "lucide-react";

const ACTIVITIES = [
  { icon: Database, label: "sales_q4_2024.csv uploaded", time: "2m ago", accent: "#00d4ff", type: "upload" },
  { icon: LineChart, label: "EDA completed · 12 insights", time: "18m ago", accent: "#10b981", type: "eda" },
  { icon: Cpu, label: "XGBoost model trained · 94.2%", time: "1h ago", accent: "#f59e0b", type: "model" },
  { icon: MessageSquare, label: "Chat session · 8 queries", time: "2h ago", accent: "#7c3aed", type: "chat" },
  { icon: Database, label: "customer_churn.csv uploaded", time: "5h ago", accent: "#00d4ff", type: "upload" },
  { icon: LineChart, label: "Report exported · PDF", time: "1d ago", accent: "#f43f5e", type: "report" },
];

export default function RecentActivity() {
  return (
    <div className="rounded-2xl p-5" style={{ background: "rgba(18,18,24,0.8)", border: "1px solid rgba(255,255,255,0.07)" }}>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-sm font-bold" style={{ color: "#f0f0f8" }}>Recent Activity</h3>
          <p className="text-xs font-mono mt-0.5" style={{ color: "#4a4a6a" }}>Last 24 hours</p>
        </div>
        <button className="text-xs font-mono px-3 py-1.5 rounded-lg transition-all"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", color: "#8b8ba8" }}>
          View all
        </button>
      </div>

      <div className="space-y-1">
        {ACTIVITIES.map((item, i) => {
          const Icon = item.icon;
          return (
            <div key={i} className="flex items-center gap-3 px-3 py-2.5 rounded-xl group transition-all cursor-pointer"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}
              onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.03)")}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>

              <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: `${item.accent}15`, border: `1px solid ${item.accent}20` }}>
                <Icon size={13} style={{ color: item.accent }} />
              </div>

              <span className="flex-1 text-sm" style={{ color: "#8b8ba8" }}>{item.label}</span>

              <span className="text-xs font-mono flex-shrink-0" style={{ color: "#4a4a6a" }}>{item.time}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
