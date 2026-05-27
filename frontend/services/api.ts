const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface UploadResponse {
  filename: string;
  size: number;
  message: string;
  file_id: string;
}

export interface ApiError {
  detail: string;
}

async function request<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, options);

  if (!res.ok) {
    const err: ApiError = await res
      .json()
      .catch(() => ({ detail: "Unknown error" }));

    throw new Error(err.detail || `HTTP ${res.status}`);
  }

  return res.json();
}

export const api = {
  health: () =>
    request<{ status: string; version: string }>("/"),

  uploadFile: async (
    file: File,
    onProgress?: (pct: number) => void
  ): Promise<UploadResponse> => {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append("file", file);

      const xhr = new XMLHttpRequest();

      xhr.open("POST", `${API_BASE}/upload`);

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable && onProgress) {
          onProgress(
            Math.round((e.loaded / e.total) * 100)
          );
        }
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(JSON.parse(xhr.responseText));
        } else {
          reject(
            new Error(`Upload failed: ${xhr.statusText}`)
          );
        }
      };

      xhr.onerror = () =>
        reject(new Error("Network error during upload"));

      xhr.send(formData);
    });
  },

  fetchEDA: async (fileId: string) => {
    return request(`/eda/${fileId}`);
  },

  listUploads: async () => {
    return request("/uploads");
  },
};