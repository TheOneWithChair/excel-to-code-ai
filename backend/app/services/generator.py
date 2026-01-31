"""
Project generation service for AutoPilot.
Handles background project generation from specifications using AI.
"""
from pathlib import Path
from typing import Dict, Any
import uuid
import traceback
from datetime import datetime

from app.db.models import Project, ProjectSpec, GenerationLog
from app.services.ai_planner import get_ai_planner
from app.services.ai_code_generator import get_ai_code_generator


class ProjectGeneratorService:
    """Handles AI-driven project generation from specifications."""
    
    def __init__(self, base_path: str = "storage/generated_projects"):
        """
        Initialize generator service.
        
        Args:
            base_path: Base directory for generated projects
        """
        self.base_path = Path(base_path)
        self.base_path.mkdir(parents=True, exist_ok=True)
        self.ai_planner = get_ai_planner()
        self.ai_code_generator = get_ai_code_generator()
    
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
        Generate project files from specifications using AI.
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
                "Initializing AI-driven project generation"
            )
            await self.log_message(
                project_id,
                "initialization",
                f"Starting AI generation for project: {project.name}"
            )
            
            # Extract specs
            features_json = spec.features_json or {}
            apis_json = spec.apis_json or {}
            database_json = spec.database_json or {}
            tech_stack_json = spec.tech_stack_json or {}
            
            # Step 1: Generate project blueprint using AI
            await self.update_status(
                project_id,
                "GENERATING",
                "Creating project blueprint with AI"
            )
            await self.log_message(
                project_id,
                "planning",
                "Generating project architecture blueprint..."
            )
            
            blueprint = await self.ai_planner.generate_blueprint(
                project_name=project.name,
                tech_stack=project.tech_stack,
                features_json=features_json,
                apis_json=apis_json,
                database_json=database_json,
                tech_stack_json=tech_stack_json
            )
            
            await self.log_message(
                project_id,
                "planning",
                f"Blueprint generated with {self._count_files(blueprint)} files"
            )
            
            # Step 2: Create project directory structure
            await self.update_status(
                project_id,
                "GENERATING",
                "Creating project structure"
            )
            
            project_path = self.get_project_path(project_id)
            project_path.mkdir(parents=True, exist_ok=True)
            
            await self.log_message(
                project_id,
                "structure",
                f"Created project directory: {project_path}"
            )
            
            # Step 3: Generate files for each section
            total_files = self._count_files(blueprint)
            files_generated = 0
            
            # Generate frontend files
            if "frontend" in blueprint:
                await self.update_status(
                    project_id,
                    "GENERATING",
                    "Generating frontend code with AI"
                )
                files_generated = await self._generate_section_files(
                    project_id=project_id,
                    project_path=project_path,
                    section_name="frontend",
                    section_data=blueprint["frontend"],
                    project_name=project.name,
                    features_json=features_json,
                    apis_json=apis_json,
                    database_json=database_json,
                    tech_stack_json=tech_stack_json,
                    files_generated=files_generated,
                    total_files=total_files
                )
            
            # Generate backend files
            if "backend" in blueprint:
                await self.update_status(
                    project_id,
                    "GENERATING",
                    "Generating backend code with AI"
                )
                files_generated = await self._generate_section_files(
                    project_id=project_id,
                    project_path=project_path,
                    section_name="backend",
                    section_data=blueprint["backend"],
                    project_name=project.name,
                    features_json=features_json,
                    apis_json=apis_json,
                    database_json=database_json,
                    tech_stack_json=tech_stack_json,
                    files_generated=files_generated,
                    total_files=total_files
                )
            
            # Generate database files
            if "database" in blueprint:
                await self.update_status(
                    project_id,
                    "GENERATING",
                    "Generating database schema with AI"
                )
                files_generated = await self._generate_section_files(
                    project_id=project_id,
                    project_path=project_path,
                    section_name="database",
                    section_data=blueprint["database"],
                    project_name=project.name,
                    features_json=features_json,
                    apis_json=apis_json,
                    database_json=database_json,
                    tech_stack_json=tech_stack_json,
                    files_generated=files_generated,
                    total_files=total_files
                )
            
            # Generate root files
            if "root" in blueprint:
                await self.update_status(
                    project_id,
                    "GENERATING",
                    "Generating project documentation with AI"
                )
                files_generated = await self._generate_section_files(
                    project_id=project_id,
                    project_path=project_path,
                    section_name="root",
                    section_data=blueprint["root"],
                    project_name=project.name,
                    features_json=features_json,
                    apis_json=apis_json,
                    database_json=database_json,
                    tech_stack_json=tech_stack_json,
                    files_generated=files_generated,
                    total_files=total_files
                )
            
            # Finalize
            await self.update_status(
                project_id,
                "GENERATING",
                "Finalizing project"
            )
            await self.log_message(
                project_id,
                "finalization",
                f"Generated {files_generated} files successfully"
            )
            
            # Mark as DONE
            await self.update_status(project_id, "DONE", None)
            await self.log_message(
                project_id,
                "complete",
                f"Project '{project.name}' generated successfully with AI at {project_path}"
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
    
    def _count_files(self, blueprint: Dict[str, Any]) -> int:
        """Count total files in blueprint."""
        count = 0
        for section_name, section_data in blueprint.items():
            if isinstance(section_data, dict) and "files" in section_data:
                count += len(section_data["files"])
        return count
    
    async def _generate_section_files(
        self,
        project_id: uuid.UUID,
        project_path: Path,
        section_name: str,
        section_data: Dict[str, Any],
        project_name: str,
        features_json: Dict[str, Any],
        apis_json: Dict[str, Any],
        database_json: Dict[str, Any],
        tech_stack_json: Dict[str, Any],
        files_generated: int,
        total_files: int
    ) -> int:
        """
        Generate files for a section of the project.
        
        Args:
            project_id: Project UUID
            project_path: Base path for project
            section_name: Name of section (frontend, backend, database, root)
            section_data: Section data from blueprint
            project_name: Name of the project
            features_json: Features specs
            apis_json: API specs
            database_json: Database specs
            tech_stack_json: Tech stack specs
            files_generated: Number of files already generated
            total_files: Total files to generate
            
        Returns:
            Updated files_generated count
        """
        files = section_data.get("files", {})
        framework = section_data.get("framework", "Unknown")
        
        for file_path, file_purpose in files.items():
            files_generated += 1
            
            await self.log_message(
                project_id,
                section_name,
                f"Generating {file_path} ({files_generated}/{total_files})"
            )
            
            try:
                # Determine full file path
                if section_name == "root":
                    full_path = project_path / file_path
                else:
                    full_path = project_path / section_name / file_path
                
                # Create parent directories
                full_path.parent.mkdir(parents=True, exist_ok=True)
                
                # Get all files in this section for context
                related_files = {fp: fp_purpose for fp, fp_purpose in files.items() if fp != file_path}
                
                # Generate code using AI
                code = await self.ai_code_generator.generate_file_code(
                    file_path=file_path,
                    file_purpose=file_purpose,
                    project_name=project_name,
                    framework=framework,
                    features_json=features_json,
                    apis_json=apis_json,
                    database_json=database_json,
                    tech_stack_json=tech_stack_json,
                    related_files=related_files
                )
                
                # Write file
                full_path.write_text(code, encoding='utf-8')
                
                await self.log_message(
                    project_id,
                    section_name,
                    f"✓ Generated {file_path}"
                )
                
            except Exception as e:
                error_msg = f"Failed to generate {file_path}: {str(e)}"
                print(error_msg)
                await self.log_message(
                    project_id,
                    section_name,
                    f"✗ {error_msg}"
                )
                # Continue with other files even if one fails
        
        return files_generated


# Global generator service instance
project_generator = ProjectGeneratorService()
