"""
DataSciOS Backend — FastAPI
Day 1: Health check + file upload endpoint
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.upload import router as upload_router

app = FastAPI(
    title="DataSciOS API",
    description="Autonomous Data Scientist Platform — Backend",
    version="0.1.0",
)

# CORS — allow Next.js dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(upload_router, tags=["Upload"])


@app.get("/", summary="Health check")
async def root():
    return {
        "status": "online",
        "version": "0.1.0",
        "platform": "DataSciOS",
        "day": 1,
        "message": "Autonomous Data Scientist Platform — MVP",
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
