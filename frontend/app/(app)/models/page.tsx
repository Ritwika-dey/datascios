"use client";
import { useState, useEffect, useRef } from "react";
import ModelLeaderboard from "@/components/models/ModelLeaderboard";
import FeatureImportance from "@/components/models/FeatureImportance";
import ActualVsPredicted from "@/components/models/ActualVsPredicted";

const BASE = "http://localhost:8000";

const STATUS_LABELS: Record<string, string> = {
  queued: "Queued…",
  loading: "Loading dataset…",
  preprocessing: "Preprocessing & encoding…",
  training: "Training models…",
  done: "Complete",
  error: "Error",
};

const MODEL_ORDER = [
  "Linear Regression",
  "Ridge Regression",
  "Random Forest",
  "Gradient Boosting",
  "XGBoost",
];

export default function ModelsPage() {
  const [fileId, setFileId] = useState("");
  const [targetCol, setTargetCol] = useState("");
  const [columns, setColumns] = useState<string[]>([]);
  const [suggestedTarget, setSuggestedTarget] = useState("");
  const [jobId, setJobId] = useState("");
  const [jobData, setJobData] = useState<any>(null);
  const [status, setStatus] = useState("");
  const [currentModel, setCurrentModel] = useState("");
  const [error, setError] = useState("");
  const [loadingCols, setLoadingCols] = useState(false);
  const [activeTab, setActiveTab] = useState("leaderboard");
  const pollRef = useRef<NodeJS.Timeout | null>(null);

  const fetchColumns = async (id: string) => {
    if (!id.trim()) return;
    setLoadingCols(true);
    setError("");
    try {
      const res = await fetch(`${BASE}/columns/${id.trim()}`);
      if (!res.ok) throw new Error("File not found — upload it first");
      const json = await res.json();
      setColumns(json.numeric_columns);
      setSuggestedTarget(json.suggested_target);
      setTargetCol(json.suggested_target);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoadingCols(false);
    }
  };

  const startTraining = async () => {
    if (!fileId.trim()) return;
    setError("");
    setJobData(null);
    setStatus("queued");
    try {
      const res = await fetch(`${BASE}/train`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ file_id: fileId.trim(), target_col: targetCol }),
      });
      if (!res.ok) {
        const j = await res.json();
        throw new Error(j.detail || "Training failed to start");
      }
      const json = await res.json();
      setJobId(json.job_id);
      setTargetCol(json.target_col);
    } catch (e: any) {
      setError(e.message);
      setStatus("");
    }
  };

  // Poll for status
  useEffect(() => {
    if (!jobId) return;
    const poll = async () => {
      try {
        const res = await fetch(`${BASE}/train/${jobId}`);
        const json = await res.json();
        setStatus(json.status);
        setCurrentModel(json.current_model || "");
        if (json.status === "done" || json.status === "error") {
          setJobData(json);
          if (pollRef.current) clearInterval(pollRef.current);
        }
      } catch {}
    };
    poll();
    pollRef.current = setInterval(poll, 1500);
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [jobId]);

  const trainingInProgress = status && status !== "done" && status !== "error" && status !== "";
  const tabs = [
    { id: "leaderboard", label: "Leaderboard", color: "#818cf8" },
    { id: "features", label: "Feature Importance", color: "#22d3ee" },
    { id: "scatter", label: "Actual vs Predicted", color: "#34d399" },
  ];

  return (
    <div style={{ padding: "32px", maxWidth: "1400px" }}>
      {/* Header */}
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{
          margin: 0, fontSize: "28px", fontWeight: 700,
          background: "linear-gradient(90deg, #f472b6, #818cf8)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        }}>Model Training</h1>
        <p style={{ margin: "6px 0 0", color: "#64748b", fontSize: "14px" }}>
          Auto-train 5 ML models, compare performance, and find the best one.
        </p>
      </div>

      {/* Config panel */}
      <div style={{
        backgroundColor: "#0d0d14", border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: "12px", padding: "20px", marginBottom: "24px",
        display: "flex", flexDirection: "column", gap: "14px",
      }}>
        {/* Row 1: file id */}
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <input
            value={fileId}
            onChange={e => setFileId(e.target.value)}
            placeholder="Paste file_id from upload…"
            style={{
              flex: 1, minWidth: "200px", backgroundColor: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px",
              padding: "10px 14px", color: "#e2e8f0", fontSize: "14px", outline: "none",
            }}
          />
          <button onClick={() => fetchColumns(fileId)} disabled={loadingCols || !fileId.trim()} style={{
            padding: "10px 20px", backgroundColor: "rgba(255,255,255,0.06)",
            color: "#94a3b8", border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "8px", fontWeight: 600, fontSize: "13px",
            cursor: loadingCols || !fileId.trim() ? "not-allowed" : "pointer",
            opacity: loadingCols || !fileId.trim() ? 0.5 : 1,
          }}>
            {loadingCols ? "Loading…" : "Load Columns"}
          </button>
        </div>

        {/* Row 2: target column selector */}
        {columns.length > 0 && (
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
            <div style={{ fontSize: "13px", color: "#64748b", whiteSpace: "nowrap" }}>Target column (what to predict):</div>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {columns.map(col => (
                <button key={col} onClick={() => setTargetCol(col)} style={{
                  padding: "6px 14px", borderRadius: "6px", fontSize: "12px",
                  fontWeight: 600, border: "none", cursor: "pointer",
                  backgroundColor: targetCol === col ? "#818cf8" : "rgba(255,255,255,0.04)",
                  color: targetCol === col ? "#000" : "#94a3b8",
                  outline: col === suggestedTarget ? "1px solid rgba(129,140,248,0.4)" : "none",
                }}>
                  {col}{col === suggestedTarget ? " ✦" : ""}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Row 3: Train button */}
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <button
            onClick={startTraining}
            disabled={!fileId.trim() || trainingInProgress}
            style={{
              padding: "12px 32px", backgroundColor: "#f472b6", color: "#000",
              border: "none", borderRadius: "8px", fontWeight: 700, fontSize: "14px",
              cursor: !fileId.trim() || trainingInProgress ? "not-allowed" : "pointer",
              opacity: !fileId.trim() || trainingInProgress ? 0.5 : 1,
            }}
          >
            {trainingInProgress ? "Training…" : "Train All Models"}
          </button>
          {targetCol && <span style={{ fontSize: "13px", color: "#64748b" }}>
            Predicting: <span style={{ color: "#818cf8", fontWeight: 600 }}>{targetCol}</span>
          </span>}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div style={{
          marginBottom: "20px", padding: "14px 18px",
          backgroundColor: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)",
          borderRadius: "10px", color: "#f87171", fontSize: "14px",
        }}>⚠ {error}</div>
      )}

      {/* Training progress */}
      {trainingInProgress && (
        <div style={{
          marginBottom: "24px", backgroundColor: "#0d0d14",
          border: "1px solid rgba(255,255,255,0.06)", borderRadius: "12px", padding: "24px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "20px" }}>
            <div style={{
              width: "32px", height: "32px", borderRadius: "50%",
              border: "3px solid rgba(244,114,182,0.2)", borderTopColor: "#f472b6",
              animation: "spin 0.8s linear infinite", flexShrink: 0,
            }} />
            <div>
              <div style={{ fontSize: "15px", fontWeight: 600, color: "#e2e8f0" }}>
                {STATUS_LABELS[status] || status}
              </div>
              {currentModel && (
                <div style={{ fontSize: "13px", color: "#64748b", marginTop: "2px" }}>
                  Currently training: <span style={{ color: "#f472b6" }}>{currentModel}</span>
                </div>
              )}
            </div>
          </div>

          {/* Model progress indicators */}
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {MODEL_ORDER.map(name => {
              const isDone = jobData?.results?.some((r: any) => r.model === name);
              const isActive = currentModel === name;
              return (
                <div key={name} style={{
                  padding: "6px 14px", borderRadius: "6px", fontSize: "12px", fontWeight: 600,
                  backgroundColor: isDone ? "rgba(52,211,153,0.15)" : isActive ? "rgba(244,114,182,0.15)" : "rgba(255,255,255,0.03)",
                  color: isDone ? "#34d399" : isActive ? "#f472b6" : "#475569",
                  border: `1px solid ${isDone ? "rgba(52,211,153,0.3)" : isActive ? "rgba(244,114,182,0.3)" : "rgba(255,255,255,0.05)"}`,
                }}>
                  {isDone ? "✓ " : isActive ? "⟳ " : ""}{name}
                </div>
              );
            })}
          </div>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {/* Results */}
      {jobData?.status === "done" && (
        <>
          {/* Best model banner */}
          <div style={{
            marginBottom: "24px", padding: "20px 24px",
            background: "linear-gradient(135deg, rgba(244,114,182,0.1), rgba(129,140,248,0.1))",
            border: "1px solid rgba(244,114,182,0.2)", borderRadius: "12px",
            display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px",
          }}>
            <div>
              <div style={{ fontSize: "12px", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em" }}>Best Model</div>
              <div style={{ fontSize: "22px", fontWeight: 700, color: "#f472b6", marginTop: "4px" }}>{jobData.best_model}</div>
              <div style={{ fontSize: "13px", color: "#64748b", marginTop: "2px" }}>Predicting: {jobData.target_col}</div>
            </div>
            <div style={{ display: "flex", gap: "24px" }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "11px", color: "#64748b", textTransform: "uppercase" }}>R² Score</div>
                <div style={{ fontSize: "24px", fontWeight: 700, color: "#34d399" }}>{jobData.best_r2}</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "11px", color: "#64748b", textTransform: "uppercase" }}>Train Rows</div>
                <div style={{ fontSize: "24px", fontWeight: 700, color: "#22d3ee" }}>{jobData.n_train?.toLocaleString()}</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "11px", color: "#64748b", textTransform: "uppercase" }}>Test Rows</div>
                <div style={{ fontSize: "24px", fontWeight: 700, color: "#818cf8" }}>{jobData.n_test?.toLocaleString()}</div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", gap: "4px", marginBottom: "24px" }}>
            {tabs.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
                padding: "8px 18px", borderRadius: "8px", fontSize: "13px", fontWeight: 600,
                border: "none", cursor: "pointer",
                backgroundColor: activeTab === tab.id ? tab.color : "rgba(255,255,255,0.04)",
                color: activeTab === tab.id ? "#000" : "#94a3b8",
              }}>{tab.label}</button>
            ))}
          </div>

          {activeTab === "leaderboard" && <ModelLeaderboard results={jobData.results} bestModel={jobData.best_model} />}
          {activeTab === "features" && (
            <FeatureImportance
              results={jobData.results}
              bestModel={jobData.best_model}
            />
          )}
          {activeTab === "scatter" && <ActualVsPredicted data={jobData.actual_vs_predicted} targetCol={jobData.target_col} />}
        </>
      )}

      {jobData?.status === "error" && (
        <div style={{
          padding: "20px", backgroundColor: "rgba(248,113,113,0.08)",
          border: "1px solid rgba(248,113,113,0.2)", borderRadius: "12px",
          color: "#f87171", fontSize: "14px",
        }}>
          Training failed: {jobData.error}
        </div>
      )}
    </div>
  );
}