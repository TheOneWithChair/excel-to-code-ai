"""
Project routes for the AutoPilot project generator.
Handles project creation and management.
"""
from fastapi import APIRouter, HTTPException, status, UploadFile, File, BackgroundTasks
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from pathlib import Path
import uuid

from app.db.models import Project, Project_Pydantic
from app.services import storage_service, excel_parser, spec_service, project_generator, get_ai_optimizer
from app.utils import build_file_tree, file_reader


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


class GenerateProjectResponse(BaseModel):
    """Response model for project generation."""
    message: str
    project_id: uuid.UUID
    status: str


@router.post("/{project_id}/generate", response_model=GenerateProjectResponse)
async def generate_project(
    project_id: uuid.UUID,
    background_tasks: BackgroundTasks
):
    """
    Generate project files from specifications.
    Runs generation as a background task.
    
    Args:
        project_id: UUID of the project
        background_tasks: FastAPI background tasks
        
    Returns:
        Confirmation that generation has started
    """
    # Validate project exists
    project = await Project.filter(id=project_id).first()
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Project with id {project_id} not found"
        )
    
    # Check if project has specifications
    from app.db.models import ProjectSpec
    spec = await ProjectSpec.filter(project_id=project_id).first()
    if not spec:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Project specifications not found. Please upload Excel files first."
        )
    
    # Check if project is in valid state for generation
    if project.status == "GENERATING":
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Project generation is already in progress"
        )
    
    if project.status == "DONE":
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Project has already been generated"
        )
    
    try:
        # Add generation task to background
        background_tasks.add_task(
            project_generator.generate_project,
            project_id
        )
        
        return GenerateProjectResponse(
            message="Project generation started",
            project_id=project_id,
            status="GENERATING"
        )
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to start project generation: {str(e)}"
        )


@router.get("/{project_id}/files")
async def get_project_files(project_id: uuid.UUID) -> List[Dict[str, Any]]:
    """
    Get file tree structure for a generated project.
    
    Args:
        project_id: UUID of the project
        
    Returns:
        List of file tree nodes representing the project structure
    """
    # Validate project exists
    project = await Project.filter(id=project_id).first()
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Project with id {project_id} not found"
        )
    
    # Get project directory path
    project_path = Path("storage/generated_projects") / str(project_id)
    
    # Build and return file tree
    try:
        file_tree = build_file_tree(project_path)
        return file_tree
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to read project files: {str(e)}"
        )


class FileContentResponse(BaseModel):
    """Response model for file content."""
    path: str
    content: str


@router.get("/{project_id}/files/content", response_model=FileContentResponse)
async def get_file_content(project_id: uuid.UUID, path: str):
    """
    Get content of a specific file in a generated project.
    
    Args:
        project_id: UUID of the project
        path: Relative path to the file (e.g., "backend/main.py")
        
    Returns:
        File path and content
    """
    # Validate project exists
    project = await Project.filter(id=project_id).first()
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Project with id {project_id} not found"
        )
    
    # Validate path
    is_valid, error_msg = file_reader.validate_path(path)
    if not is_valid:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=error_msg
        )
    
    # Get project directory path
    base_dir = Path("storage/generated_projects") / str(project_id)
    
    # Read file content
    success, content, error_msg = file_reader.safe_read_file(base_dir, path)
    
    if not success:
        # Determine appropriate status code
        if error_msg and "not found" in error_msg.lower():
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=error_msg
            )
        elif error_msg and ("denied" in error_msg.lower() or "not allowed" in error_msg.lower()):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=error_msg
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=error_msg or "Failed to read file"
            )
    
    return FileContentResponse(
        path=path,
        content=content
    )


class OptimizeFilesRequest(BaseModel):
    """Request model for file optimization."""
    files: List[str] = Field(..., description="List of file paths to optimize")


class OptimizedFileResult(BaseModel):
    """Result for a single optimized file."""
    path: str
    success: bool
    message: str


class OptimizeFilesResponse(BaseModel):
    """Response model for file optimization."""
    project_id: uuid.UUID
    optimized: List[OptimizedFileResult]


@router.post("/{project_id}/optimize", response_model=OptimizeFilesResponse)
async def optimize_project_files(
    project_id: uuid.UUID,
    request: OptimizeFilesRequest
):
    """
    Optimize project files using AI.
    
    Args:
        project_id: UUID of the project
        request: List of file paths to optimize
        
    Returns:
        Results of optimization for each file
    """
    # Validate project exists
    project = await Project.filter(id=project_id).first()
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Project with id {project_id} not found"
        )
    
    # Get project directory path
    base_dir = Path("storage/generated_projects") / str(project_id)
    
    if not base_dir.exists():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Generated project files not found"
        )
    
    results = []
    
    # Import models for optimization tracking
    from app.db.models import ProjectFile, GenerationLog
    
    for file_path in request.files:
        try:
            # Validate path
            is_valid, error_msg = file_reader.validate_path(file_path)
            if not is_valid:
                results.append(OptimizedFileResult(
                    path=file_path,
                    success=False,
                    message=f"Invalid path: {error_msg}"
                ))
                continue
            
            # Read file content
            success, content, error_msg = file_reader.safe_read_file(base_dir, file_path)
            
            if not success:
                results.append(OptimizedFileResult(
                    path=file_path,
                    success=False,
                    message=error_msg or "Failed to read file"
                ))
                continue
            
            # Build optimization prompt
            prompt = f"""Optimize the following code. Improve:
- Code quality and readability
- Performance and efficiency
- Error handling
- Documentation and comments
- Best practices

File: {file_path}

Code:
{content}

Return ONLY the optimized code without explanations."""
            
            # Log optimization start
            await GenerationLog.create(
                project_id=project_id,
                step="optimization",
                message=f"Starting AI optimization for {file_path}"
            )
            
            # Call AI optimizer
            try:
                ai_optimizer = get_ai_optimizer()
                optimized_content = await ai_optimizer.optimize_code(prompt)
                
                # Write optimized content back to file
                file_full_path = base_dir / file_path
                file_full_path.write_text(optimized_content, encoding='utf-8')
                
                # Update or create ProjectFile record
                project_file = await ProjectFile.filter(
                    project_id=project_id,
                    path=file_path
                ).first()
                
                if project_file:
                    project_file.is_optimized = True
                    await project_file.save()
                else:
                    # Determine file type from path
                    if "backend" in file_path:
                        file_type = "backend"
                    elif "frontend" in file_path:
                        file_type = "frontend"
                    elif "database" in file_path:
                        file_type = "database"
                    else:
                        file_type = "docs"
                    
                    await ProjectFile.create(
                        project_id=project_id,
                        path=file_path,
                        file_type=file_type,
                        is_optimized=True
                    )
                
                # Log success
                await GenerationLog.create(
                    project_id=project_id,
                    step="optimization",
                    message=f"Successfully optimized {file_path}"
                )
                
                results.append(OptimizedFileResult(
                    path=file_path,
                    success=True,
                    message="File optimized successfully"
                ))
            
            except Exception as ai_error:
                error_message = f"AI optimization failed: {str(ai_error)}"
                
                # Log failure
                await GenerationLog.create(
                    project_id=project_id,
                    step="optimization_error",
                    message=f"Failed to optimize {file_path}: {error_message}"
                )
                
                results.append(OptimizedFileResult(
                    path=file_path,
                    success=False,
                    message=error_message
                ))
        
        except Exception as e:
            results.append(OptimizedFileResult(
                path=file_path,
                success=False,
                message=f"Unexpected error: {str(e)}"
            ))
    
    return OptimizeFilesResponse(
        project_id=project_id,
        optimized=results
    )
