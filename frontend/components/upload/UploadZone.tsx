"use client";
import { useState, useRef } from "react";

type FileState = { file: File; status: "idle" | "uploading" | "success" | "error"; progress: number; fileId?: string };

export default function UploadZone() {
  const [files, setFiles] = useState<FileState[]>([]);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = (incoming: File[]) => {
    const valid = incoming.filter(f => /\.(csv|xlsx|xls)$/i.test(f.name));
    setFiles(prev => [...prev, ...valid.map(f => ({ file: f, status: "idle" as const, progress: 0 }))]);
  };

  const upload = async (idx: number) => {
    const item = files[idx];
    if (!item || item.status === "uploading") return;

    setFiles(prev => prev.map((f, i) => i === idx ? { ...f, status: "uploading", progress: 0 } : f));

    const formData = new FormData();
    formData.append("file", item.file);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost:8000/upload");

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        const pct = Math.round((e.loaded / e.total) * 100);
        setFiles(prev => prev.map((f, i) => i === idx ? { ...f, progress: pct } : f));
      }
    };

    xhr.onload = () => {
      if (xhr.status === 200) {
        const data = JSON.parse(xhr.responseText);
        setFiles(prev => prev.map((f, i) => i === idx ? { ...f, status: "success", progress: 100, fileId: data.file_id } : f));
      } else {
        setFiles(prev => prev.map((f, i) => i === idx ? { ...f, status: "error" } : f));
      }
    };

    xhr.onerror = () => setFiles(prev => prev.map((f, i) => i === idx ? { ...f, status: "error" } : f));
    xhr.send(formData);
  };

  return (
    <div>
      {/* Drop zone */}
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => { e.preventDefault(); setDragging(false); addFiles(Array.from(e.dataTransfer.files)); }}
        style={{
          border: `2px dashed ${dragging ? "#22d3ee" : "rgba(255,255,255,0.1)"}`,
          borderRadius: "12px",
          padding: "48px 32px",
          textAlign: "center",
          cursor: "pointer",
          backgroundColor: dragging ? "rgba(34,211,238,0.04)" : "rgba(255,255,255,0.02)",
          transition: "all 0.2s",
          marginBottom: "24px",
        }}
      >
        <div style={{ fontSize: "32px", marginBottom: "12px" }}>⬆</div>
        <div style={{ fontSize: "15px", color: "#e2e8f0", fontWeight: 600, marginBottom: "6px" }}>Drop your dataset here</div>
        <div style={{ fontSize: "13px", color: "#64748b" }}>Supports CSV, XLSX, XLS · Max 50MB</div>
        <input ref={inputRef} type="file" accept=".csv,.xlsx,.xls" multiple hidden
          onChange={e => addFiles(Array.from(e.target.files || []))} />
      </div>

      {/* File list */}
      {files.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {files.map((item, idx) => (
            <div key={idx} style={{
              backgroundColor: "#0d0d14",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: "10px",
              padding: "16px",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <span style={{ fontSize: "13px", color: "#e2e8f0", fontWeight: 500 }}>{item.file.name}</span>
                <span style={{ fontSize: "11px", color: "#64748b" }}>
                  {(item.file.size / 1024).toFixed(1)} KB
                </span>
              </div>

              {item.status === "idle" && (
                <button onClick={() => upload(idx)} style={{
                  padding: "6px 16px", backgroundColor: "#22d3ee", color: "#000",
                  border: "none", borderRadius: "6px", fontSize: "12px", fontWeight: 600, cursor: "pointer",
                }}>Upload</button>
              )}

              {item.status === "uploading" && (
                <div>
                  <div style={{ height: "4px", backgroundColor: "rgba(255,255,255,0.06)", borderRadius: "2px", overflow: "hidden" }}>
                    <div style={{ width: `${item.progress}%`, height: "100%", backgroundColor: "#22d3ee", borderRadius: "2px", transition: "width 0.2s" }} />
                  </div>
                  <div style={{ fontSize: "11px", color: "#64748b", marginTop: "4px" }}>{item.progress}%</div>
                </div>
              )}

              {item.status === "success" && (
                <div style={{ fontSize: "12px", color: "#34d399" }}>✓ Uploaded · ID: {item.fileId}</div>
              )}

              {item.status === "error" && (
                <div style={{ fontSize: "12px", color: "#f87171" }}>✗ Upload failed — is the backend running?</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}