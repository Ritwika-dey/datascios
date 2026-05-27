from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.upload import router as upload_router
from routes.eda import router as eda_router
from routes.models import router as models_router

app = FastAPI(title="DataScios API", version="3.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload_router)
app.include_router(eda_router)
app.include_router(models_router)

@app.get("/")
def root():
    return {"status": "ok", "message": "DataScios API v3"}