"""
Main FastAPI application for AutoPilot project generator.
Initializes the app, database, and routes.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.config import settings
from app.db import init_db, close_db
from app.routes import projects_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifespan manager.
    Handles startup and shutdown events for database initialization.
    """
    # Startup
    print("Initializing database connection...")
    await init_db()
    print("Database initialized successfully!")
    
    yield
    
    # Shutdown
    print("Closing database connection...")
    await close_db()
    print("Database connection closed.")


# Create FastAPI application
app = FastAPI(
    title=settings.app_name,
    description="Backend API for AutoPilot project generator",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(projects_router)


@app.get("/")
async def root():
    """Root endpoint for health check."""
    return {
        "message": "AutoPilot Project Generator API",
        "status": "running",
        "version": "1.0.0"
    }


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}
