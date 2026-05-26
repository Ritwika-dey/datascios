"use client";
import UploadZone from "@/components/upload/UploadZone";

export default function UploadPage() {
  return (
    <div style={{ padding: "32px", maxWidth: "900px" }}>
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{
          margin: 0,
          fontSize: "28px",
          fontWeight: 700,
          background: "linear-gradient(90deg, #34d399, #22d3ee)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}>
          Upload Dataset
        </h1>
        <p style={{ margin: "6px 0 0", color: "#64748b", fontSize: "14px" }}>
          Upload CSV or Excel files — the platform handles the rest.
        </p>
      </div>
      <UploadZone />
    </div>
  );
}