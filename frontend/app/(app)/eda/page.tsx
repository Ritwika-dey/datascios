"use client";

import { useState } from "react";

import EDAOverview from "@/components/eda/EDAOverview";
import EDAMissing from "@/components/eda/EDAMissing";
import EDANumeric from "@/components/eda/EDANumeric";
import EDACategorical from "@/components/eda/EDACategorical";
import EDACorrelation from "@/components/eda/EDACorrelation";
import EDASample from "@/components/eda/EDASample";

const BASE = "http://localhost:8000";

const tabs = [
  { id: "overview", label: "Overview", color: "#22d3ee" },
  { id: "missing", label: "Missing Values", color: "#f472b6" },
  { id: "numeric", label: "Numeric Stats", color: "#818cf8" },
  { id: "categorical", label: "Categorical", color: "#34d399" },
  { id: "correlation", label: "Correlation", color: "#fb923c" },
  { id: "sample", label: "Sample Data", color: "#facc15" },
];

export default function EDAPage() {
  const [fileId, setFileId] = useState<string>("");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [uploads, setUploads] = useState<any[]>([]);
  const [showPicker, setShowPicker] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const loadUploads = async () => {
    try {
      const res = await fetch(`${BASE}/uploads`);
      const json = await res.json();

      setUploads(json.files || []);
      setShowPicker(true);
    } catch {
      setError(
        "Could not load uploads. Is the backend running on port 8000?"
      );
    }
  };

  const runEDA = async (id?: string) => {
    const target = (id || fileId || "").trim();

    if (!target) return;

    setLoading(true);
    setError("");
    setData(null);
    setShowPicker(false);

    try {
      const res = await fetch(`${BASE}/eda/${target}`);

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));

        throw new Error(
          errJson.detail || `HTTP ${res.status}`
        );
      }

      const json = await res.json();

      setData(json);
      setActiveTab("overview");
    } catch (e: any) {
      setError(e.message || "EDA failed — unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "32px", maxWidth: "1400px" }}>
      {/* Header */}
      <div style={{ marginBottom: "32px" }}>
        <h1
          style={{
            margin: 0,
            fontSize: "28px",
            fontWeight: 700,
            background:
              "linear-gradient(90deg, #818cf8, #22d3ee)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Exploratory Data Analysis
        </h1>

        <p
          style={{
            margin: "6px 0 0",
            color: "#64748b",
            fontSize: "14px",
          }}
        >
          Automatic statistics, distributions,
          correlations and missing value analysis.
        </p>
      </div>

      {/* Input bar */}
      <div
        style={{
          display: "flex",
          gap: "12px",
          marginBottom: "24px",
          backgroundColor: "#0d0d14",
          border:
            "1px solid rgba(255,255,255,0.06)",
          borderRadius: "12px",
          padding: "16px",
          flexWrap: "wrap",
        }}
      >
        <input
          value={fileId || ""}
          onChange={(e) =>
            setFileId(e.target.value || "")
          }
          placeholder="Paste file_id from upload..."
          style={{
            flex: 1,
            minWidth: "200px",
            backgroundColor:
              "rgba(255,255,255,0.04)",
            border:
              "1px solid rgba(255,255,255,0.08)",
            borderRadius: "8px",
            padding: "10px 14px",
            color: "#e2e8f0",
            fontSize: "14px",
            outline: "none",
          }}
          onKeyDown={(e) =>
            e.key === "Enter" && runEDA()
          }
        />

        <button
          onClick={() => runEDA()}
          disabled={
            loading || !fileId || !fileId.trim()
          }
          style={{
            padding: "10px 24px",
            backgroundColor: "#818cf8",
            color: "#000",
            border: "none",
            borderRadius: "8px",
            fontWeight: 700,
            fontSize: "13px",
            cursor:
              loading || !fileId || !fileId.trim()
                ? "not-allowed"
                : "pointer",
            opacity:
              loading || !fileId || !fileId.trim()
                ? 0.5
                : 1,
          }}
        >
          {loading ? "Analysing…" : "Run EDA"}
        </button>

        <button
          onClick={loadUploads}
          style={{
            padding: "10px 20px",
            backgroundColor:
              "rgba(255,255,255,0.06)",
            color: "#94a3b8",
            border:
              "1px solid rgba(255,255,255,0.08)",
            borderRadius: "8px",
            fontWeight: 600,
            fontSize: "13px",
            cursor: "pointer",
          }}
        >
          Pick File
        </button>
      </div>

      {/* File picker */}
      {showPicker && (
        <div
          style={{
            marginBottom: "24px",
            backgroundColor: "#0d0d14",
            border:
              "1px solid rgba(255,255,255,0.08)",
            borderRadius: "12px",
            overflow: "hidden",
          }}
        >
          {uploads.length === 0 ? (
            <div
              style={{
                padding: "20px",
                color: "#64748b",
                fontSize: "14px",
              }}
            >
              No uploads found.
            </div>
          ) : (
            uploads.map((u: any) => (
              <div
                key={u.file_id || u.filename}
                onClick={() => {
                  setFileId(u.file_id || "");
                  runEDA(u.file_id || "");
                }}
                style={{
                  padding: "14px 20px",
                  cursor: "pointer",
                  borderBottom:
                    "1px solid rgba(255,255,255,0.04)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    "rgba(255,255,255,0.04)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    "transparent")
                }
              >
                <span
                  style={{
                    fontSize: "14px",
                    color: "#e2e8f0",
                  }}
                >
                  {u.filename}
                </span>

                <span
                  style={{
                    fontSize: "11px",
                    color: "#64748b",
                    fontFamily: "monospace",
                  }}
                >
                  {u.file_id}
                </span>
              </div>
            ))
          )}
        </div>
      )}

      {/* Error */}
      {error && (
        <div
          style={{
            marginBottom: "24px",
            padding: "14px 18px",
            backgroundColor:
              "rgba(248,113,113,0.08)",
            border:
              "1px solid rgba(248,113,113,0.2)",
            borderRadius: "10px",
            color: "#f87171",
            fontSize: "14px",
          }}
        >
          ⚠ {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "80px 0",
            gap: "16px",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              border:
                "3px solid rgba(129,140,248,0.2)",
              borderTopColor: "#818cf8",
              animation:
                "spin 0.8s linear infinite",
            }}
          />

          <div
            style={{
              color: "#64748b",
              fontSize: "14px",
            }}
          >
            Running analysis…
          </div>

          <style>
            {`@keyframes spin {
              to {
                transform: rotate(360deg);
              }
            }`}
          </style>
        </div>
      )}

      {/* Results */}
      {data && !loading && (
        <>
          <div
            style={{
              display: "flex",
              gap: "24px",
              flexWrap: "wrap",
              backgroundColor: "#0d0d14",
              border:
                "1px solid rgba(255,255,255,0.06)",
              borderRadius: "10px",
              padding: "14px 20px",
              marginBottom: "20px",
              fontSize: "13px",
            }}
          >
            {[
              {
                label: "Rows",
                value:
                  data?.overview?.rows?.toLocaleString?.() ||
                  0,
                color: "#22d3ee",
              },
              {
                label: "Columns",
                value:
                  data?.overview?.columns || 0,
                color: "#818cf8",
              },
            ].map((s) => (
              <div
                key={s.label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <span style={{ color: "#64748b" }}>
                  {s.label}:
                </span>

                <span
                  style={{
                    fontWeight: 700,
                    color: s.color,
                  }}
                >
                  {s.value}
                </span>
              </div>
            ))}
          </div>

          <div
            style={{
              display: "flex",
              gap: "4px",
              marginBottom: "24px",
              flexWrap: "wrap",
            }}
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: "8px 18px",
                  borderRadius: "8px",
                  fontSize: "13px",
                  fontWeight: 600,
                  border: "none",
                  cursor: "pointer",
                  backgroundColor:
                    activeTab === tab.id
                      ? tab.color
                      : "rgba(255,255,255,0.04)",
                  color:
                    activeTab === tab.id
                      ? "#000"
                      : "#94a3b8",
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div>
            {activeTab === "overview" && (
              <EDAOverview data={data.overview} />
            )}

            {activeTab === "missing" && (
              <EDAMissing
                data={data.missing}
                totalRows={data.overview.rows}
              />
            )}

            {activeTab === "numeric" && (
              <EDANumeric
                data={data.numeric_stats}
              />
            )}

            {activeTab === "categorical" && (
              <EDACategorical
                data={data.categorical_stats}
              />
            )}

            {activeTab === "correlation" && (
              <EDACorrelation
                data={data.correlation}
                columns={
                  data.overview.column_names
                }
              />
            )}

            {activeTab === "sample" && (
              <EDASample data={data.sample} />
            )}
          </div>
        </>
      )}
    </div>
  );
}