from contextlib import asynccontextmanager
from typing import Dict

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine, settings
import app.models  # noqa: F401 - ensures SQLAlchemy models are registered
from app.routers.task import router as task_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifespan context manager.
    Initializes database tables automatically on application startup
    as specified in the technical test requirements.
    """
    # Create missing tables if they don't already exist (idempotent)
    Base.metadata.create_all(bind=engine)
    yield


# Create FastAPI application instance
app = FastAPI(
    title=settings.APP_NAME,
    description="REST API for Task Tracker - Technical Test Software Engineer Intern (GLI)",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# Allowed origins for CORS (React + Vite development servers and Docker frontend)
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:8080",
    "http://127.0.0.1:8080",
]

# Enable Cross-Origin Resource Sharing (CORS)
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(task_router)


@app.get(
    "/health",
    tags=["Health"],
    summary="Health Check",
    description="Check the operational status of the Task Tracker API.",
)
def health_check() -> Dict[str, str]:
    """Return health status of the application."""
    return {
        "status": "healthy",
        "app": settings.APP_NAME,
    }


@app.get(
    "/",
    tags=["Root"],
    summary="Root Endpoint",
    description="Welcome endpoint providing links to API documentation and health status.",
)
def root() -> Dict[str, str]:
    """Root endpoint welcoming users and directing to API docs."""
    return {
        "message": f"Welcome to {settings.APP_NAME}",
        "docs_url": "/docs",
        "redoc_url": "/redoc",
        "health_url": "/health",
    }

