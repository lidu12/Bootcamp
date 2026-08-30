from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import engine, Base
import app.models # Register models for metadata creation

from app.api.auth import router as auth_router
from app.api.users import router as users_router
from app.api.streaks import router as streaks_router
from app.api.submissions import router as submissions_router
from app.api.export import router as export_router
from app.api.roadmap import router as roadmap_router

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Devbloom - Full-Stack Learning Bootcamp Tracker API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS setup
cors_origins = settings.CORS_ORIGINS
if isinstance(cors_origins, str):
    cors_origins = [cors_origins]

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins or ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
api_v1 = settings.API_V1_STR
app.include_router(auth_router, prefix=api_v1)
app.include_router(users_router, prefix=api_v1)
app.include_router(streaks_router, prefix=api_v1)
app.include_router(submissions_router, prefix=api_v1)
app.include_router(export_router, prefix=api_v1)
app.include_router(roadmap_router, prefix=api_v1)

@app.get("/")
def root():
    return {
        "status": "online",
        "app": settings.PROJECT_NAME,
        "docs": "/docs",
        "version": "1.0.0"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
