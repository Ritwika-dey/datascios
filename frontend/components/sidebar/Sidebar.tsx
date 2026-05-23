"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Upload,
  BarChart3,
  Brain,
  MessageSquare,
  FileText,
  Zap,
  ChevronRight,
} from "lucide-react";
import { cn } from "../../lib/utils";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard, accent: "#00d4ff" },
  { label: "Upload Dataset", href: "/upload", icon: Upload, accent: "#7c3aed" },
  { label: "EDA", href: "/eda", icon: BarChart3, accent: "#10b981" },
  { label: "Models", href: "/models", icon: Brain, accent: "#f59e0b" },
  { label: "Chat", href: "/chat", icon: MessageSquare, accent: "#f43f5e" },
  { label: "Reports", href: "/reports", icon: FileText, accent: "#8b5cf6" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-full w-64 flex flex-col z-40"
      style={{ background: "rgba(10,10,14,0.95)", borderRight: "1px solid rgba(255,255,255,0.06)", backdropFilter: "blur(40px)" }}>

      {/* Logo */}
      <div className="p-6 pb-4">
        <div className="flex items-center gap-3">
          <div className="relative w-8 h-8">
            <div className="absolute inset-0 rounded-lg animate-spin-slow"
              style={{ background: "conic-gradient(from 0deg, #00d4ff, #7c3aed, #00d4ff)", padding: "1px" }}>
              <div className="w-full h-full rounded-lg" style={{ background: "#0c0c10" }} />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Zap size={14} className="text-cyan-400" style={{ color: "#00d4ff" }} />
            </div>
          </div>
          <div>
            <div className="text-sm font-bold tracking-tight" style={{ color: "#f0f0f8" }}>DataSciOS</div>
            <div className="text-xs font-mono" style={{ color: "#4a4a6a" }}>v1.0 · MVP</div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="mx-6 mb-4" style={{ height: "1px", background: "rgba(255,255,255,0.05)" }} />

      {/* Label */}
      <div className="px-6 mb-2">
        <span className="text-xs font-mono uppercase tracking-widest" style={{ color: "#4a4a6a" }}>Navigation</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}
              className={cn(
                "group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 relative overflow-hidden",
                active ? "text-white" : "text-gray-400 hover:text-white"
              )}
              style={active ? {
                background: `linear-gradient(135deg, ${item.accent}18, ${item.accent}08)`,
                border: `1px solid ${item.accent}30`,
                boxShadow: `0 0 20px ${item.accent}10`
              } : {
                border: "1px solid transparent",
              }}>

              {active && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full"
                  style={{ background: item.accent, boxShadow: `0 0 8px ${item.accent}` }} />
              )}

              <Icon size={16}
                style={{ color: active ? item.accent : undefined }}
                className={cn("transition-colors", !active && "group-hover:text-white")} />

              <span className="flex-1">{item.label}</span>

              {active && (
                <ChevronRight size={12} style={{ color: item.accent }} className="opacity-60" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom status */}
      <div className="p-4 m-3 rounded-xl" style={{ background: "rgba(0,212,255,0.04)", border: "1px solid rgba(0,212,255,0.12)" }}>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-1.5 h-1.5 rounded-full animate-pulse-glow" style={{ background: "#00d4ff" }} />
          <span className="text-xs font-mono" style={{ color: "#00d4ff" }}>System Online</span>
        </div>
        <div className="text-xs" style={{ color: "#4a4a6a" }}>Backend · FastAPI v0.1</div>
        <div className="mt-2 h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
          <div className="h-full rounded-full w-1/3" style={{ background: "linear-gradient(90deg, #00d4ff, #7c3aed)" }} />
        </div>
        <div className="mt-1 text-xs" style={{ color: "#4a4a6a" }}>Day 1 of 8 · MVP Progress</div>
      </div>
    </aside>
  );
}
