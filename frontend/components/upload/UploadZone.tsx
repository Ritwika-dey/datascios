"use client";

import { useState, useCallback, useRef } from "react";
import { Upload, File, X, CheckCircle, AlertCircle, CloudUpload, Loader } from "lucide-react";
import { cn, formatBytes } from "../../lib/utils";
import { api } from "../../services/api";

interface UploadedFile {
  file: File;
  status: "idle" | "uploading" | "success" | "error";
  progress: number;
  error?: string;
  response?: { filename: string; file_id: string };
}

export default function UploadZone() {
  const [dragging, setDragging] = useState(false);
  const [uploads, setUploads] = useState<UploadedFile[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback((files: File[]) => {
    const valid = files.filter(f =>
      f.name.endsWith(".csv") || f.name.endsWith(".xlsx") || f.name.endsWith(".xls")
    );
    const newUploads: UploadedFile[] = valid.map(f => ({ file: f, status: "idle", progress: 0 }));
    setUploads(prev => [...prev, ...newUploads]);
    newUploads.forEach((_, i) => uploadFile(uploads.length + i, valid[i]));
  }, [uploads.length]);

  const uploadFile = async (index: number, file: File) => {
    setUploads(prev => prev.map((u, i) =>
      i === index ? { ...u, status: "uploading" } : u
    ));

    try {
      const response = await api.uploadFile(file, (progress) => {
        setUploads(prev => prev.map((u, i) =>
          i === index ? { ...u, progress } : u
        ));
      });

      setUploads(prev => prev.map((u, i) =>
        i === index ? { ...u, status: "success", progress: 100, response } : u
      ));
    } catch (err) {
      setUploads(prev => prev.map((u, i) =>
        i === index ? { ...u, status: "error", error: (err as Error).message } : u
      ));
    }
  };

  const removeFile = (index: number) => {
    setUploads(prev => prev.filter((_, i) => i !== index));
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    addFiles(Array.from(e.dataTransfer.files));
  };

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={cn(
          "relative cursor-pointer rounded-2xl p-12 text-center transition-all duration-300",
          dragging ? "scale-[1.01]" : "scale-100"
        )}
        style={{
          background: dragging
            ? "rgba(0,212,255,0.06)"
            : "rgba(18,18,24,0.6)",
          border: dragging
            ? "2px dashed rgba(0,212,255,0.5)"
            : "2px dashed rgba(255,255,255,0.1)",
          boxShadow: dragging ? "0 0 40px rgba(0,212,255,0.1)" : "none",
        }}>

        {/* Animated background on drag */}
        {dragging && (
          <div className="absolute inset-0 rounded-2xl pointer-events-none overflow-hidden">
            <div className="absolute inset-0 animate-pulse-glow"
              style={{ background: "radial-gradient(ellipse at center, rgba(0,212,255,0.08), transparent 70%)" }} />
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept=".csv,.xlsx,.xls"
          multiple
          onChange={(e) => addFiles(Array.from(e.target.files || []))}
        />

        <div className="flex flex-col items-center gap-4 relative z-10">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{
              background: dragging ? "rgba(0,212,255,0.15)" : "rgba(255,255,255,0.05)",
              border: dragging ? "1px solid rgba(0,212,255,0.3)" : "1px solid rgba(255,255,255,0.1)",
              transition: "all 0.3s",
            }}>
            <CloudUpload size={28} style={{ color: dragging ? "#00d4ff" : "#4a4a6a" }} />
          </div>

          <div>
            <p className="text-base font-semibold mb-1" style={{ color: dragging ? "#00d4ff" : "#f0f0f8" }}>
              {dragging ? "Release to upload" : "Drop your dataset here"}
            </p>
            <p className="text-sm" style={{ color: "#4a4a6a" }}>
              or <span style={{ color: "#00d4ff" }}>click to browse</span> · CSV, XLSX supported
            </p>
          </div>

          <div className="flex items-center gap-3">
            {["CSV", "XLSX", "XLS"].map(ext => (
              <span key={ext} className="text-xs font-mono px-2 py-1 rounded-lg"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "#8b8ba8" }}>
                .{ext}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* File list */}
      {uploads.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-mono uppercase tracking-widest" style={{ color: "#4a4a6a" }}>
            Files · {uploads.length}
          </p>
          {uploads.map((upload, i) => (
            <div key={i} className="flex items-center gap-3 p-4 rounded-xl"
              style={{ background: "rgba(18,18,24,0.8)", border: "1px solid rgba(255,255,255,0.07)" }}>

              {/* File icon */}
              <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(0,212,255,0.08)", border: "1px solid rgba(0,212,255,0.15)" }}>
                <File size={16} style={{ color: "#00d4ff" }} />
              </div>

              {/* File info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-medium truncate" style={{ color: "#f0f0f8" }}>{upload.file.name}</p>
                  <span className="text-xs font-mono flex-shrink-0" style={{ color: "#4a4a6a" }}>
                    {formatBytes(upload.file.size)}
                  </span>
                </div>

                {/* Progress bar */}
                {upload.status === "uploading" && (
                  <div>
                    <div className="h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                      <div className="h-full rounded-full transition-all duration-300"
                        style={{ width: `${upload.progress}%`, background: "linear-gradient(90deg, #00d4ff, #7c3aed)" }} />
                    </div>
                    <p className="text-xs font-mono mt-1" style={{ color: "#4a4a6a" }}>{upload.progress}% uploaded</p>
                  </div>
                )}

                {upload.status === "success" && (
                  <p className="text-xs font-mono" style={{ color: "#10b981" }}>
                    ✓ Uploaded · ID: {upload.response?.file_id}
                  </p>
                )}

                {upload.status === "error" && (
                  <p className="text-xs font-mono" style={{ color: "#f43f5e" }}>✗ {upload.error}</p>
                )}

                {upload.status === "idle" && (
                  <p className="text-xs font-mono" style={{ color: "#4a4a6a" }}>Queued...</p>
                )}
              </div>

              {/* Status icon */}
              <div className="flex-shrink-0">
                {upload.status === "uploading" && <Loader size={16} className="animate-spin" style={{ color: "#00d4ff" }} />}
                {upload.status === "success" && <CheckCircle size={16} style={{ color: "#10b981" }} />}
                {upload.status === "error" && <AlertCircle size={16} style={{ color: "#f43f5e" }} />}
                {upload.status === "idle" && (
                  <button onClick={() => removeFile(i)}>
                    <X size={16} style={{ color: "#4a4a6a" }} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
