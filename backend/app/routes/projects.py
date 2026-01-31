"""
Project routes for the AutoPilot project generator.
Handles project creation and management.
"""
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
import uuid

from app.db.models import Project, Project_Pydantic


router = APIRouter(prefix="/projects", tags=["projects"])


class CreateProjectRequest(BaseModel):
    """Request model for creating a new project."""
    name: str = Field(..., min_length=1, max_length=255, description="Project name")
    tech_stack: str = Field(..., min_length=1, max_length=255, description="Technology stack")


class CreateProjectResponse(BaseModel):
    """Response model for project creation."""
    id: uuid.UUID
    status: str
    created_at: datetime


@router.post("", response_model=CreateProjectResponse, status_code=status.HTTP_201_CREATED)
async def create_project(project_data: CreateProjectRequest):
    """
    Create a new project with PENDING status.
    
    Args:
        project_data: Project name and tech stack
        
    Returns:
        Project ID, status, and creation timestamp
    """
    try:
        # Create new project with PENDING status
        project = await Project.create(
            name=project_data.name,
            tech_stack=project_data.tech_stack,
            status="PENDING"
        )
        
        return CreateProjectResponse(
            id=project.id,
            status=project.status,
            created_at=project.created_at
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create project: {str(e)}"
        )


@router.get("/{project_id}", response_model=Project_Pydantic)
async def get_project(project_id: uuid.UUID):
    """
    Get project details by ID.
    
    Args:
        project_id: UUID of the project
        
    Returns:
        Complete project information
    """
    project = await Project.filter(id=project_id).first()
    
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Project with id {project_id} not found"
        )
    
    return await Project_Pydantic.from_tortoise_orm(project)
