"use client";

import { Bell, Search, User, Command } from "lucide-react";

interface NavbarProps {
  title?: string;
  subtitle?: string;
}

export default function Navbar({ title = "Dashboard", subtitle = "Overview & Analytics" }: NavbarProps) {
  return (
    <header className="h-16 flex items-center px-6 gap-4"
      style={{
        background: "rgba(8,8,12,0.8)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        backdropFilter: "blur(20px)",
        position: "sticky",
        top: 0,
        zIndex: 30,
      }}>

      {/* Title */}
      <div className="flex-1">
        <h1 className="text-base font-bold tracking-tight" style={{ color: "#f0f0f8" }}>{title}</h1>
        <p className="text-xs font-mono" style={{ color: "#4a4a6a" }}>{subtitle}</p>
      </div>

      {/* Search bar */}
      <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg text-sm"
        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", color: "#4a4a6a", cursor: "pointer", minWidth: 200 }}>
        <Search size={14} />
        <span className="flex-1 text-xs">Search anything...</span>
        <div className="flex items-center gap-1 px-1.5 py-0.5 rounded text-xs"
          style={{ background: "rgba(255,255,255,0.06)", color: "#4a4a6a" }}>
          <Command size={10} />
          <span>K</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* Notification bell */}
        <button className="relative w-9 h-9 rounded-lg flex items-center justify-center transition-all"
          style={{ border: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.03)" }}>
          <Bell size={15} style={{ color: "#8b8ba8" }} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full"
            style={{ background: "#00d4ff", boxShadow: "0 0 6px #00d4ff" }} />
        </button>

        {/* Avatar */}
        <div className="w-9 h-9 rounded-lg flex items-center justify-center relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, #7c3aed, #00d4ff)", border: "1px solid rgba(255,255,255,0.1)" }}>
          <User size={15} style={{ color: "white" }} />
        </div>
      </div>
    </header>
  );
}
