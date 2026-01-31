"""
File storage service for handling uploaded files.
Manages temporary file storage for Excel specifications.
"""
from pathlib import Path
from typing import List
from fastapi import UploadFile
import uuid
import shutil


class StorageService:
    """Handles file storage operations."""
    
    def __init__(self, base_path: str = "storage/uploads"):
        """
        Initialize storage service.
        
        Args:
            base_path: Base directory for file storage
        """
        self.base_path = Path(base_path)
        self.base_path.mkdir(parents=True, exist_ok=True)
    
    def get_project_storage_path(self, project_id: uuid.UUID) -> Path:
        """
        Get storage path for a specific project.
        
        Args:
            project_id: UUID of the project
            
        Returns:
            Path object for project storage directory
        """
        project_path = self.base_path / str(project_id)
        project_path.mkdir(parents=True, exist_ok=True)
        return project_path
    
    async def save_uploaded_file(
        self, 
        file: UploadFile, 
        project_id: uuid.UUID,
        filename: str = None
    ) -> Path:
        """
        Save an uploaded file to project storage.
        
        Args:
            file: FastAPI UploadFile object
            project_id: UUID of the project
            filename: Optional custom filename (uses file.filename if not provided)
            
        Returns:
            Path to saved file
        """
        project_path = self.get_project_storage_path(project_id)
        target_filename = filename or file.filename
        file_path = project_path / target_filename
        
        # Save file
        with file_path.open("wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        return file_path
    
    async def save_multiple_files(
        self,
        files: List[UploadFile],
        project_id: uuid.UUID
    ) -> List[Path]:
        """
        Save multiple uploaded files to project storage.
        
        Args:
            files: List of FastAPI UploadFile objects
            project_id: UUID of the project
            
        Returns:
            List of paths to saved files
        """
        saved_paths = []
        for file in files:
            file_path = await self.save_uploaded_file(file, project_id)
            saved_paths.append(file_path)
        
        return saved_paths
    
    def delete_project_storage(self, project_id: uuid.UUID) -> None:
        """
        Delete all files for a specific project.
        
        Args:
            project_id: UUID of the project
        """
        project_path = self.get_project_storage_path(project_id)
        if project_path.exists():
            shutil.rmtree(project_path)
    
    def get_file_path(self, project_id: uuid.UUID, filename: str) -> Path:
        """
        Get path to a specific file in project storage.
        
        Args:
            project_id: UUID of the project
            filename: Name of the file
            
        Returns:
            Path to the file
        """
        return self.get_project_storage_path(project_id) / filename


# Global storage service instance
storage_service = StorageService()
