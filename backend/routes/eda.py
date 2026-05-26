from fastapi import APIRouter, HTTPException
from services.eda_service import run_eda

router = APIRouter()


@router.get("/eda/{file_id}")
def get_eda(file_id: str):
    try:
        result = run_eda(file_id)
        return result
    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"EDA failed: {str(e)}")