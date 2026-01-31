"""
Project specification service for managing ProjectSpec operations.
Handles creation and updates of project specifications.
"""
from typing import Dict, Any, Optional
import uuid

from app.db.models import ProjectSpec, Project


class SpecService:
    """Manages ProjectSpec database operations."""
    
    @staticmethod
    async def create_or_update_spec(
        project_id: uuid.UUID,
        features_json: Dict[str, Any] = None,
        apis_json: Dict[str, Any] = None,
        database_json: Dict[str, Any] = None,
        tech_stack_json: Dict[str, Any] = None
    ) -> ProjectSpec:
        """
        Create or update ProjectSpec for a project.
        
        Args:
            project_id: UUID of the project
            features_json: Parsed features data
            apis_json: Parsed APIs data
            database_json: Parsed database schema data
            tech_stack_json: Parsed tech stack data
            
        Returns:
            Created or updated ProjectSpec instance
        """
        # Check if spec already exists for this project
        existing_spec = await ProjectSpec.filter(project_id=project_id).first()
        
        if existing_spec:
            # Update existing spec
            if features_json is not None:
                existing_spec.features_json = features_json
            if apis_json is not None:
                existing_spec.apis_json = apis_json
            if database_json is not None:
                existing_spec.database_json = database_json
            if tech_stack_json is not None:
                existing_spec.tech_stack_json = tech_stack_json
            
            await existing_spec.save()
            return existing_spec
        else:
            # Create new spec
            spec = await ProjectSpec.create(
                project_id=project_id,
                features_json=features_json or {},
                apis_json=apis_json or {},
                database_json=database_json or {},
                tech_stack_json=tech_stack_json or {}
            )
            return spec
    
    @staticmethod
    async def get_spec(project_id: uuid.UUID) -> Optional[ProjectSpec]:
        """
        Get ProjectSpec for a project.
        
        Args:
            project_id: UUID of the project
            
        Returns:
            ProjectSpec instance or None if not found
        """
        return await ProjectSpec.filter(project_id=project_id).first()
    
    @staticmethod
    async def delete_spec(project_id: uuid.UUID) -> bool:
        """
        Delete ProjectSpec for a project.
        
        Args:
            project_id: UUID of the project
            
        Returns:
            True if deleted, False if not found
        """
        spec = await ProjectSpec.filter(project_id=project_id).first()
        if spec:
            await spec.delete()
            return True
        return False


# Global spec service instance
spec_service = SpecService()
