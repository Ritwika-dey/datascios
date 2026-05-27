from fastapi import APIRouter, BackgroundTasks, HTTPException
from pydantic import BaseModel
import uuid
from services.model_service import train_models, training_jobs, load_df, suggest_target

router = APIRouter()


class TrainRequest(BaseModel):
    file_id: str
    target_col: str = ""


@router.post("/train")
def start_training(req: TrainRequest, background_tasks: BackgroundTasks):
    job_id = str(uuid.uuid4())[:8]

    # If no target col provided, auto-suggest
    if not req.target_col:
        try:
            df = load_df(req.file_id)
            req.target_col = suggest_target(df)
        except Exception as e:
            raise HTTPException(status_code=404, detail=str(e))

    training_jobs[job_id] = {
        "job_id": job_id,
        "file_id": req.file_id,
        "target_col": req.target_col,
        "status": "queued",
        "current_model": "",
    }

    background_tasks.add_task(train_models, req.file_id, req.target_col, job_id)
    return {"job_id": job_id, "target_col": req.target_col}


@router.get("/train/{job_id}")
def get_training_status(job_id: str):
    if job_id not in training_jobs:
        raise HTTPException(status_code=404, detail="Job not found")
    return training_jobs[job_id]


@router.get("/columns/{file_id}")
def get_columns(file_id: str):
    try:
        df = load_df(file_id)
        import numpy as np
        numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
        suggested = suggest_target(df)
        return {"columns": df.columns.tolist(), "numeric_columns": numeric_cols, "suggested_target": suggested}
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))