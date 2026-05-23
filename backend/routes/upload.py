"""
Upload Router — handles dataset file ingestion.
Accepts CSV and XLSX files, validates, stores, returns metadata.
"""

import uuid
import os
from pathlib import Path
from fastapi import APIRouter, UploadFile, File, HTTPException
from pydantic import BaseModel

router = APIRouter()

UPLOAD_DIR = Path(__file__).parent.parent / "uploads"
UPLOAD_DIR.mkdir(exist_ok=True)

ALLOWED_EXTENSIONS = {".csv", ".xlsx", ".xls"}
MAX_FILE_SIZE = 50 * 1024 * 1024  # 50 MB


class UploadResponse(BaseModel):
    file_id: str
    filename: str
    original_name: str
    size: int
    extension: str
    message: str


@router.post("/upload", response_model=UploadResponse, summary="Upload dataset file")
async def upload_file(file: UploadFile = File(...)):
    """
    Upload a CSV or XLSX dataset file.
    - Validates file type by extension
    - Assigns a unique file_id
    - Saves to disk under /uploads/
    - Returns file metadata
    """

    # Validate extension
    suffix = Path(file.filename or "").suffix.lower()
    if suffix not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type '{suffix}'. Allowed: {', '.join(ALLOWED_EXTENSIONS)}"
        )

    # Read content & check size
    content = await file.read()
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(status_code=413, detail="File too large. Max size is 50 MB.")

    if len(content) == 0:
        raise HTTPException(status_code=400, detail="File is empty.")

    # Generate unique ID and save
    file_id = str(uuid.uuid4())[:8]
    safe_name = f"{file_id}{suffix}"
    dest_path = UPLOAD_DIR / safe_name

    with open(dest_path, "wb") as f:
        f.write(content)

    return UploadResponse(
        file_id=file_id,
        filename=safe_name,
        original_name=file.filename or "unknown",
        size=len(content),
        extension=suffix,
        message=f"Dataset '{file.filename}' uploaded successfully.",
    )


@router.get("/uploads", summary="List uploaded datasets")
async def list_uploads():
    """Return all uploaded files with metadata."""
    files = []
    for f in UPLOAD_DIR.iterdir():
        if f.is_file() and f.suffix.lower() in ALLOWED_EXTENSIONS:
            stat = f.stat()
            files.append({
                "filename": f.name,
                "size": stat.st_size,
                "extension": f.suffix,
                "created_at": stat.st_ctime,
            })
    files.sort(key=lambda x: x["created_at"], reverse=True)
    return {"count": len(files), "files": files}
