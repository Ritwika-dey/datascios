"use client";

import { Database, Cpu, Sparkles, Target } from "lucide-react";
import Navbar from "../../components/sidebar/Navbar";
import StatCard from "../../components/dashboard/StatCard";
import RecentActivity from "../../components/dashboard/RecentActivity";
import { ModelAccuracyChart, ModelComparisonChart, TaskDistributionChart } from "../../components/charts/DashboardCharts";

const STATS = [
  {
    label: "Total Datasets",
    value: "24",
    delta: "+3 this week",
    deltaPositive: true,
    icon: Database,
    accent: "#00d4ff",
    description: "12 CSV · 8 XLSX · 4 JSON",
  },
  {
    label: "Models Trained",
    value: "47",
    delta: "+8 this week",
    deltaPositive: true,
    icon: Cpu,
    accent: "#7c3aed",
    description: "XGBoost · RF · LightGBM · SVM",
  },
  {
    label: "Insights Generated",
    value: "312",
    delta: "+41 today",
    deltaPositive: true,
    icon: Sparkles,
    accent: "#10b981",
    description: "Powered by GPT-4o",
  },
  {
    label: "Best Accuracy",
    value: "94.2%",
    delta: "+2.1%",
    deltaPositive: true,
    icon: Target,
    accent: "#f59e0b",
    description: "XGBoost · customer_churn.csv",
  },
];

export default function DashboardPage() {
  return (
    <div className="min-h-screen">
      <Navbar title="Dashboard" subtitle="Platform overview · Day 1 MVP" />

      <div className="p-6 space-y-6">

        {/* Welcome banner */}
        <div className="rounded-2xl p-6 relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, rgba(124,58,237,0.15), rgba(0,212,255,0.1))",
            border: "1px solid rgba(124,58,237,0.25)",
          }}>
          <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full"
            style={{ background: "radial-gradient(circle, rgba(0,212,255,0.15), transparent 70%)" }} />
          <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full"
            style={{ background: "radial-gradient(circle, rgba(124,58,237,0.2), transparent 70%)" }} />

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full animate-pulse-glow" style={{ background: "#10b981" }} />
              <span className="text-xs font-mono uppercase tracking-widest" style={{ color: "#10b981" }}>Platform Active</span>
            </div>
            <h2 className="text-2xl font-bold mb-1" style={{ color: "#f0f0f8" }}>
              Welcome to <span className="gradient-text">DataSciOS</span>
            </h2>
            <p className="text-sm" style={{ color: "#8b8ba8" }}>
              Autonomous data science platform · Upload a dataset to begin your analysis pipeline.
            </p>
          </div>
        </div>

        {/* Stat cards grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {STATS.map((stat, i) => (
            <StatCard key={stat.label} {...stat} index={i} />
          ))}
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ModelAccuracyChart />
          <ModelComparisonChart />
        </div>

        {/* Bottom row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <RecentActivity />
          </div>
          <TaskDistributionChart />
        </div>
      </div>
    </div>
  );
}
