"""
Project generation service for AutoPilot.
Handles background project generation from specifications.
"""
from pathlib import Path
from typing import Dict, Any
import uuid
import traceback
from datetime import datetime

from app.db.models import Project, ProjectSpec, GenerationLog
from app.utils.file_generator import FileGenerator


class ProjectGeneratorService:
    """Handles project generation from specifications."""
    
    def __init__(self, base_path: str = "storage/generated_projects"):
        """
        Initialize generator service.
        
        Args:
            base_path: Base directory for generated projects
        """
        self.base_path = Path(base_path)
        self.base_path.mkdir(parents=True, exist_ok=True)
        self.file_generator = FileGenerator()
    
    def get_project_path(self, project_id: uuid.UUID) -> Path:
        """
        Get path for generated project.
        
        Args:
            project_id: UUID of the project
            
        Returns:
            Path to project directory
        """
        return self.base_path / str(project_id)
    
    async def log_message(
        self,
        project_id: uuid.UUID,
        step: str,
        message: str
    ) -> None:
        """
        Log a generation step.
        
        Args:
            project_id: UUID of the project
            step: Current generation step
            message: Log message
        """
        await GenerationLog.create(
            project_id=project_id,
            step=step,
            message=message
        )
    
    async def update_status(
        self,
        project_id: uuid.UUID,
        status: str,
        current_step: str = None
    ) -> None:
        """
        Update project status.
        
        Args:
            project_id: UUID of the project
            status: New status
            current_step: Current step description
        """
        project = await Project.get(id=project_id)
        project.status = status
        project.current_step = current_step
        await project.save()
    
    async def generate_project(self, project_id: uuid.UUID) -> None:
        """
        Generate project files from specifications.
        This runs as a background task.
        
        Args:
            project_id: UUID of the project
        """
        try:
            # Get project and specs
            project = await Project.get(id=project_id)
            spec = await ProjectSpec.filter(project_id=project_id).first()
            
            if not spec:
                raise Exception("Project specifications not found")
            
            # Update status to GENERATING
            await self.update_status(
                project_id,
                "GENERATING",
                "Initializing project generation"
            )
            await self.log_message(
                project_id,
                "initialization",
                f"Starting generation for project: {project.name}"
            )
            
            # Create project directory structure
            await self.update_status(
                project_id,
                "GENERATING",
                "Creating project structure"
            )
            await self.log_message(
                project_id,
                "structure",
                "Creating directory structure"
            )
            
            project_path = self.get_project_path(project_id)
            project_path.mkdir(parents=True, exist_ok=True)
            
            # Create subdirectories
            (project_path / "backend").mkdir(exist_ok=True)
            (project_path / "frontend").mkdir(exist_ok=True)
            (project_path / "database").mkdir(exist_ok=True)
            
            await self.log_message(
                project_id,
                "structure",
                f"Created project directory: {project_path}"
            )
            
            # Prepare specs
            specs = {
                "features_json": spec.features_json,
                "apis_json": spec.apis_json,
                "database_json": spec.database_json,
                "tech_stack_json": spec.tech_stack_json
            }
            
            # Generate backend files
            await self.update_status(
                project_id,
                "GENERATING",
                "Generating backend files"
            )
            await self.log_message(
                project_id,
                "backend",
                "Generating backend/main.py"
            )
            
            backend_main = self.file_generator.generate_backend_main(
                project.name,
                project.tech_stack,
                specs
            )
            (project_path / "backend" / "main.py").write_text(backend_main, encoding='utf-8')
            
            await self.log_message(
                project_id,
                "backend",
                "Generating backend/requirements.txt"
            )
            
            backend_req = self.file_generator.generate_backend_requirements(
                project.tech_stack
            )
            (project_path / "backend" / "requirements.txt").write_text(backend_req, encoding='utf-8')
            
            # Generate frontend files
            await self.update_status(
                project_id,
                "GENERATING",
                "Generating frontend files"
            )
            await self.log_message(
                project_id,
                "frontend",
                "Generating frontend/README.md"
            )
            
            frontend_readme = self.file_generator.generate_frontend_readme(
                project.name,
                project.tech_stack
            )
            (project_path / "frontend" / "README.md").write_text(frontend_readme, encoding='utf-8')
            
            # Generate database files
            await self.update_status(
                project_id,
                "GENERATING",
                "Generating database schema"
            )
            await self.log_message(
                project_id,
                "database",
                "Generating database/schema.sql"
            )
            
            db_schema = self.file_generator.generate_database_schema(
                project.name,
                specs
            )
            (project_path / "database" / "schema.sql").write_text(db_schema, encoding='utf-8')
            
            # Generate root files
            await self.update_status(
                project_id,
                "GENERATING",
                "Generating project documentation"
            )
            await self.log_message(
                project_id,
                "documentation",
                "Generating README.md"
            )
            
            main_readme = self.file_generator.generate_project_readme(
                project.name,
                project.tech_stack,
                specs
            )
            (project_path / "README.md").write_text(main_readme, encoding='utf-8')
            
            await self.log_message(
                project_id,
                "documentation",
                "Generating .gitignore"
            )
            
            gitignore = self.file_generator.generate_gitignore()
            (project_path / ".gitignore").write_text(gitignore, encoding='utf-8')
            
            # Finalize
            await self.update_status(
                project_id,
                "GENERATING",
                "Finalizing project"
            )
            await self.log_message(
                project_id,
                "finalization",
                "Project generation completed successfully"
            )
            
            # Mark as DONE
            await self.update_status(project_id, "DONE", None)
            await self.log_message(
                project_id,
                "complete",
                f"Project '{project.name}' generated successfully at {project_path}"
            )
            
        except Exception as e:
            # Log error and update status to FAILED
            error_msg = f"Generation failed: {str(e)}"
            print(f"Error generating project {project_id}: {error_msg}")
            print(traceback.format_exc())
            
            try:
                await self.update_status(
                    project_id,
                    "FAILED",
                    error_msg
                )
                await self.log_message(
                    project_id,
                    "error",
                    error_msg
                )
            except Exception as log_error:
                print(f"Failed to log error: {log_error}")


# Global generator service instance
project_generator = ProjectGeneratorService()
