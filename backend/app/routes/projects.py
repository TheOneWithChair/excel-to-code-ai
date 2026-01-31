"""
Project routes for the AutoPilot project generator.
Handles project creation and management.
"""
from fastapi import APIRouter, HTTPException, status, UploadFile, File
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
import uuid

from app.db.models import Project, Project_Pydantic
from app.services import storage_service, excel_parser, spec_service


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


class UploadSpecsResponse(BaseModel):
    """Response model for spec upload."""
    project_id: uuid.UUID
    status: str
    message: str
    uploaded_files: List[str]


@router.post("/{project_id}/upload-specs", response_model=UploadSpecsResponse)
async def upload_specs(
    project_id: uuid.UUID,
    features: Optional[UploadFile] = File(None),
    apis: Optional[UploadFile] = File(None),
    database: Optional[UploadFile] = File(None),
    tech_stack: Optional[UploadFile] = File(None)
):
    """
    Upload and parse Excel specification files for a project.
    
    Expected files:
    - features.xlsx: Feature specifications
    - apis.xlsx: API endpoint specifications
    - database.xlsx: Database schema specifications
    - tech_stack.xlsx: Technology stack specifications
    
    Args:
        project_id: UUID of the project
        features: Features Excel file (optional)
        apis: APIs Excel file (optional)
        database: Database Excel file (optional)
        tech_stack: Tech stack Excel file (optional)
        
    Returns:
        Upload status and list of processed files
    """
    # Validate project exists
    project = await Project.filter(id=project_id).first()
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Project with id {project_id} not found"
        )
    
    # Check if at least one file was uploaded
    uploaded_files = []
    file_mapping = {
        "features.xlsx": features,
        "apis.xlsx": apis,
        "database.xlsx": database,
        "tech_stack.xlsx": tech_stack
    }
    
    if not any(file_mapping.values()):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="At least one Excel file must be uploaded"
        )
    
    try:
        # Update project status to PARSING
        project.status = "PARSING"
        project.current_step = "Parsing Excel specs"
        await project.save()
        
        # Save uploaded files
        saved_paths = {}
        for filename, file in file_mapping.items():
            if file:
                file_path = await storage_service.save_uploaded_file(
                    file, project_id, filename
                )
                saved_paths[filename] = file_path
                uploaded_files.append(filename)
        
        # Parse Excel files
        parsed_data = {
            "features": {},
            "apis": {},
            "database": {},
            "tech_stack": {}
        }
        
        if "features.xlsx" in saved_paths:
            parsed_data["features"] = excel_parser.parse_features_excel(
                saved_paths["features.xlsx"]
            )
        
        if "apis.xlsx" in saved_paths:
            parsed_data["apis"] = excel_parser.parse_apis_excel(
                saved_paths["apis.xlsx"]
            )
        
        if "database.xlsx" in saved_paths:
            parsed_data["database"] = excel_parser.parse_database_excel(
                saved_paths["database.xlsx"]
            )
        
        if "tech_stack.xlsx" in saved_paths:
            parsed_data["tech_stack"] = excel_parser.parse_tech_stack_excel(
                saved_paths["tech_stack.xlsx"]
            )
        
        # Store parsed data in database
        await spec_service.create_or_update_spec(
            project_id=project_id,
            features_json=parsed_data["features"],
            apis_json=parsed_data["apis"],
            database_json=parsed_data["database"],
            tech_stack_json=parsed_data["tech_stack"]
        )
        
        # Update project status to PARSED (or back to PENDING)
        project.status = "PENDING"  # Or use "PARSED" if you prefer
        project.current_step = None
        await project.save()
        
        return UploadSpecsResponse(
            project_id=project_id,
            status=project.status,
            message="Excel specifications uploaded and parsed successfully",
            uploaded_files=uploaded_files
        )
    
    except Exception as e:
        # Rollback status on error
        project.status = "FAILED"
        project.current_step = f"Error: {str(e)}"
        await project.save()
        
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to upload and parse specifications: {str(e)}"
        )
