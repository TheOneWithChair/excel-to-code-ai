"""
Database models for the AutoPilot project generator.
Uses Tortoise ORM with PostgreSQL.
"""
from tortoise import fields, models
from tortoise.contrib.pydantic import pydantic_model_creator
import uuid


class Project(models.Model):
    """Main project model representing a generated project."""
    
    id = fields.UUIDField(pk=True, default=uuid.uuid4)
    name = fields.CharField(max_length=255)
    tech_stack = fields.CharField(max_length=255)
    status = fields.CharField(
        max_length=50,
        default="PENDING",
        description="PENDING | PARSING | GENERATING | DONE | FAILED"
    )
    current_step = fields.CharField(max_length=255, null=True)
    created_at = fields.DatetimeField(auto_now_add=True)
    updated_at = fields.DatetimeField(auto_now=True)
    
    class Meta:
        table = "projects"
    
    def __str__(self):
        return f"Project({self.name}, {self.status})"


class ProjectSpec(models.Model):
    """Project specification storing parsed requirements."""
    
    id = fields.UUIDField(pk=True, default=uuid.uuid4)
    project = fields.ForeignKeyField(
        "models.Project",
        related_name="spec",
        on_delete=fields.CASCADE
    )
    features_json = fields.JSONField(default=dict)
    apis_json = fields.JSONField(default=dict)
    database_json = fields.JSONField(default=dict)
    tech_stack_json = fields.JSONField(default=dict)
    created_at = fields.DatetimeField(auto_now_add=True)
    
    class Meta:
        table = "project_specs"
    
    def __str__(self):
        return f"ProjectSpec(project={self.project_id})"


class ProjectFile(models.Model):
    """Generated project files metadata."""
    
    id = fields.UUIDField(pk=True, default=uuid.uuid4)
    project = fields.ForeignKeyField(
        "models.Project",
        related_name="files",
        on_delete=fields.CASCADE
    )
    path = fields.TextField()
    file_type = fields.CharField(
        max_length=50,
        description="backend | frontend | config | docs"
    )
    is_optimized = fields.BooleanField(default=False)
    created_at = fields.DatetimeField(auto_now_add=True)
    
    class Meta:
        table = "project_files"
    
    def __str__(self):
        return f"ProjectFile({self.path}, {self.file_type})"


class GenerationLog(models.Model):
    """Logs for tracking project generation steps."""
    
    id = fields.UUIDField(pk=True, default=uuid.uuid4)
    project = fields.ForeignKeyField(
        "models.Project",
        related_name="logs",
        on_delete=fields.CASCADE
    )
    step = fields.CharField(max_length=255)
    message = fields.TextField()
    timestamp = fields.DatetimeField(auto_now_add=True)
    
    class Meta:
        table = "generation_logs"
        ordering = ["timestamp"]
    
    def __str__(self):
        return f"GenerationLog({self.step}, {self.timestamp})"


# Pydantic models for API responses
Project_Pydantic = pydantic_model_creator(Project, name="Project")
ProjectIn_Pydantic = pydantic_model_creator(Project, name="ProjectIn", exclude_readonly=True)
ProjectSpec_Pydantic = pydantic_model_creator(ProjectSpec, name="ProjectSpec")
ProjectFile_Pydantic = pydantic_model_creator(ProjectFile, name="ProjectFile")
GenerationLog_Pydantic = pydantic_model_creator(GenerationLog, name="GenerationLog")
