"use client";

import { usePathname } from "next/navigation";
import "./globals.css";

const navItems = [
  { label: "Dashboard", href: "/", icon: "⬡", color: "#22d3ee" },
  { label: "Upload Data", href: "/upload", icon: "⬆", color: "#34d399" },
  { label: "EDA", href: "/eda", icon: "◈", color: "#818cf8" },
  { label: "Models", href: "/models", icon: "⬟", color: "#f472b6" },
  { label: "AI Chat", href: "/chat", icon: "◉", color: "#fb923c" },
  { label: "Reports", href: "/reports", icon: "◧", color: "#facc15" },
];

function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      style={{
        width: "240px",
        minWidth: "240px",
        backgroundColor: "#0d0d14",
        borderRight: "1px solid rgba(255,255,255,0.06)",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        position: "sticky",
        top: 0,
      }}
    >
      <div
        style={{
          padding: "24px 20px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div
          style={{
            fontSize: "18px",
            fontWeight: 700,
            background: "linear-gradient(90deg, #22d3ee, #818cf8)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          DataScios
        </div>

        <div
          style={{
            fontSize: "11px",
            color: "#64748b",
            marginTop: "2px",
          }}
        >
          Autonomous Data Scientist
        </div>
      </div>

      <nav style={{ padding: "16px 12px", flex: 1 }}>
        {navItems.map((item) => {
          const active = pathname === item.href;

          return (
            <a
              key={item.href}
              href={item.href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "10px 12px",
                borderRadius: "8px",
                marginBottom: "4px",
                textDecoration: "none",
                color: active ? "#e2e8f0" : "#94a3b8",
                fontSize: "14px",
                fontWeight: 500,
                backgroundColor: active
                  ? "rgba(255,255,255,0.06)"
                  : "transparent",
                borderLeft: active
                  ? `3px solid ${item.color}`
                  : "3px solid transparent",
                transition: "all 0.2s ease",
              }}
            >
              <span
                style={{
                  color: item.color,
                  fontSize: "16px",
                }}
              >
                {item.icon}
              </span>

              {item.label}
            </a>
          );
        })}
      </nav>

      <div
        style={{
          padding: "16px 20px",
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div
          style={{
            fontSize: "11px",
            color: "#475569",
          }}
        >
          Day 1 of 8 · Foundation
        </div>

        <div
          style={{
            marginTop: "6px",
            height: "3px",
            backgroundColor: "rgba(255,255,255,0.06)",
            borderRadius: "2px",
          }}
        >
          <div
            style={{
              width: "12.5%",
              height: "100%",
              background: "linear-gradient(90deg, #22d3ee, #818cf8)",
              borderRadius: "2px",
            }}
          />
        </div>
      </div>
    </aside>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          padding: 0,
          backgroundColor: "#0a0a0f",
          color: "#e2e8f0",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            minHeight: "100vh",
          }}
        >
          <Sidebar />

          <main
            style={{
              flex: 1,
              minHeight: "100vh",
              overflowY: "auto",
              backgroundColor: "#0a0a0f",
            }}
          >
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}