"use client";

import { TrendingUp, TrendingDown, LucideIcon } from "lucide-react";
import { cn } from "../../lib/utils";

interface StatCardProps {
  label: string;
  value: string;
  delta?: string;
  deltaPositive?: boolean;
  icon: LucideIcon;
  accent: string;
  description?: string;
  index?: number;
}

export default function StatCard({
  label, value, delta, deltaPositive = true,
  icon: Icon, accent, description, index = 0
}: StatCardProps) {
  return (
    <div
      className="card-hover animate-slide-in rounded-2xl p-5 relative overflow-hidden"
      style={{
        background: "rgba(18,18,24,0.8)",
        border: "1px solid rgba(255,255,255,0.07)",
        animationDelay: `${index * 0.08}s`,
        animationFillMode: "forwards",
        opacity: 0,
      }}>

      {/* Ambient glow */}
      <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full pointer-events-none"
        style={{ background: `radial-gradient(circle, ${accent}20, transparent 70%)` }} />

      {/* Top row */}
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: `${accent}15`, border: `1px solid ${accent}25` }}>
          <Icon size={18} style={{ color: accent }} />
        </div>

        {delta && (
          <div className={cn("flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-mono")}
            style={{
              background: deltaPositive ? "rgba(16,185,129,0.1)" : "rgba(244,63,94,0.1)",
              color: deltaPositive ? "#10b981" : "#f43f5e",
              border: `1px solid ${deltaPositive ? "rgba(16,185,129,0.2)" : "rgba(244,63,94,0.2)"}`,
            }}>
            {deltaPositive ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
            {delta}
          </div>
        )}
      </div>

      {/* Value */}
      <div className="mb-1">
        <span className="text-3xl font-bold tracking-tight" style={{ color: "#f0f0f8" }}>{value}</span>
      </div>

      {/* Label */}
      <div className="text-sm font-medium mb-1" style={{ color: "#8b8ba8" }}>{label}</div>

      {/* Description */}
      {description && (
        <div className="text-xs font-mono" style={{ color: "#4a4a6a" }}>{description}</div>
      )}

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${accent}40, transparent)` }} />
    </div>
  );
}
