"""
Configuration management for the AutoPilot project generator.
Loads settings from environment variables using python-dotenv.
"""
from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    
    # Database configuration
    database_url: str
    
    # Application configuration
    app_name: str = "AutoPilot Project Generator"
    debug: bool = False
    
    # Groq AI configuration
    groq_api_key: Optional[str] = None
    groq_model: str = "llama3-70b-8192"
    
    class Config:
        env_file = ".env"
        case_sensitive = False


# Global settings instance
settings = Settings()
