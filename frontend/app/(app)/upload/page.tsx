"use client";

import Navbar from "@/components/sidebar/Navbar";
import UploadZone from "@/components/upload/UploadZone";
import { Database, FileText, Table } from "lucide-react";

const TIPS = [
  { icon: FileText, title: "CSV Files", desc: "Comma-separated values. Ensure first row is header." },
  { icon: Table, title: "XLSX Files", desc: "Excel format. First sheet will be used for analysis." },
  { icon: Database, title: "Auto EDA", desc: "Once uploaded, run EDA to get instant AI insights." },
];

export default function UploadPage() {
  return (
    <div className="min-h-screen">
      <Navbar title="Upload Dataset" subtitle="Import CSV or XLSX files for analysis" />

      <div className="p-6 max-w-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Main upload area */}
          <div className="lg:col-span-2 space-y-4">
            <div>
              <h2 className="text-lg font-bold mb-1" style={{ color: "#f0f0f8" }}>Import Dataset</h2>
              <p className="text-sm" style={{ color: "#4a4a6a" }}>
                Upload your data file to begin the analysis pipeline. Supports CSV and Excel formats.
              </p>
            </div>
            <UploadZone />
          </div>

          {/* Sidebar tips */}
          <div className="space-y-3">
            <p className="text-xs font-mono uppercase tracking-widest" style={{ color: "#4a4a6a" }}>Supported Formats</p>
            {TIPS.map((tip, i) => {
              const Icon = tip.icon;
              return (
                <div key={i} className="p-4 rounded-xl"
                  style={{ background: "rgba(18,18,24,0.8)", border: "1px solid rgba(255,255,255,0.07)" }}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                      style={{ background: "rgba(0,212,255,0.1)", border: "1px solid rgba(0,212,255,0.2)" }}>
                      <Icon size={13} style={{ color: "#00d4ff" }} />
                    </div>
                    <span className="text-sm font-semibold" style={{ color: "#f0f0f8" }}>{tip.title}</span>
                  </div>
                  <p className="text-xs" style={{ color: "#4a4a6a" }}>{tip.desc}</p>
                </div>
              );
            })}

            {/* Pipeline preview */}
            <div className="p-4 rounded-xl mt-4"
              style={{ background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.2)" }}>
              <p className="text-xs font-mono mb-3" style={{ color: "#7c3aed" }}>PIPELINE STAGES</p>
              {["Upload", "Validate", "EDA", "Model", "Insights"].map((step, i) => (
                <div key={i} className="flex items-center gap-2 mb-2">
                  <div className="w-5 h-5 rounded-full text-xs flex items-center justify-center font-mono flex-shrink-0"
                    style={{
                      background: i === 0 ? "rgba(0,212,255,0.2)" : "rgba(255,255,255,0.05)",
                      border: i === 0 ? "1px solid rgba(0,212,255,0.4)" : "1px solid rgba(255,255,255,0.08)",
                      color: i === 0 ? "#00d4ff" : "#4a4a6a",
                    }}>{i + 1}</div>
                  <span className="text-xs" style={{ color: i === 0 ? "#f0f0f8" : "#4a4a6a" }}>{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
