"""
AI-powered project planning service using Groq API.
Generates project blueprints from specifications.
"""
import httpx
import json
from typing import Dict, Any
from app.config import settings


class AIProjectPlanner:
    """Generates project blueprints using AI based on specifications."""
    
    GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"
    
    def __init__(self):
        """Initialize HTTP client."""
        if not settings.groq_api_key:
            raise ValueError(
                "GROQ_API_KEY is not configured. Please set GROQ_API_KEY in your .env file."
            )
        self.api_key = settings.groq_api_key
        self.model = settings.groq_model
    
    async def generate_blueprint(
        self,
        project_name: str,
        tech_stack: str,
        features_json: Dict[str, Any],
        apis_json: Dict[str, Any],
        database_json: Dict[str, Any],
        tech_stack_json: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Generate a project blueprint using AI.
        
        Args:
            project_name: Name of the project
            tech_stack: Tech stack selection
            features_json: Features from Excel
            apis_json: API definitions from Excel
            database_json: Database schema from Excel
            tech_stack_json: Tech stack details from Excel
            
        Returns:
            Blueprint dict with structure:
            {
                "frontend": {
                    "framework": "React",
                    "files": {
                        "path/to/file.tsx": "purpose description"
                    }
                },
                "backend": {
                    "framework": "FastAPI",
                    "files": {
                        "path/to/file.py": "purpose description"
                    }
                },
                "database": {
                    "files": {
                        "schema.sql": "purpose description"
                    }
                },
                "root": {
                    "files": {
                        "README.md": "purpose description"
                    }
                }
            }
        """
        prompt = self._build_blueprint_prompt(
            project_name,
            tech_stack,
            features_json,
            apis_json,
            database_json,
            tech_stack_json
        )
        
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "model": self.model,
            "messages": [
                {
                    "role": "system",
                    "content": """You are a senior software architect. You design complete project structures based on requirements.

CRITICAL RULES:
1. Return ONLY a valid JSON object
2. NO markdown formatting (no ```json or ``` tags)
3. NO explanations outside the JSON
4. The JSON must follow this exact structure:
{
  "frontend": {
    "framework": "string",
    "files": {
      "relative/path/file.ext": "purpose description"
    }
  },
  "backend": {
    "framework": "string",
    "files": {
      "relative/path/file.py": "purpose description"
    }
  },
  "database": {
    "files": {
      "schema.sql": "purpose description"
    }
  },
  "root": {
    "files": {
      "README.md": "purpose description",
      ".gitignore": "purpose description"
    }
  }
}

Your output must be parseable by json.loads(). Start with { and end with }."""
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            "temperature": 0.3,
            "max_tokens": 4096
        }
        
        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.post(
                self.GROQ_API_URL,
                headers=headers,
                json=payload
            )
            response.raise_for_status()
            
            result = response.json()
            ai_response = result["choices"][0]["message"]["content"].strip()
            
            # Clean up potential markdown formatting
            if ai_response.startswith("```json"):
                ai_response = ai_response[7:]
            if ai_response.startswith("```"):
                ai_response = ai_response[3:]
            if ai_response.endswith("```"):
                ai_response = ai_response[:-3]
            ai_response = ai_response.strip()
            
            # Parse JSON
            try:
                blueprint = json.loads(ai_response)
                return blueprint
            except json.JSONDecodeError as e:
                print(f"Failed to parse blueprint JSON: {e}")
                print(f"AI Response: {ai_response[:500]}")
                # Return minimal fallback blueprint
                return self._get_fallback_blueprint(tech_stack)
    
    def _build_blueprint_prompt(
        self,
        project_name: str,
        tech_stack: str,
        features_json: Dict[str, Any],
        apis_json: Dict[str, Any],
        database_json: Dict[str, Any],
        tech_stack_json: Dict[str, Any]
    ) -> str:
        """Build the prompt for blueprint generation."""
        return f"""Design a complete project structure for: {project_name}

TECH STACK: {tech_stack}

FEATURES:
{json.dumps(features_json, indent=2)}

API ENDPOINTS:
{json.dumps(apis_json, indent=2)}

DATABASE SCHEMA:
{json.dumps(database_json, indent=2)}

TECH STACK DETAILS:
{json.dumps(tech_stack_json, indent=2)}

TASK:
Create a comprehensive file structure for this project. Include:

1. BACKEND FILES:
   - Main application entry point
   - API route files (one per domain/resource)
   - Database models
   - Configuration files
   - Requirements/dependencies file
   - Utility modules

2. FRONTEND FILES:
   - Main application component
   - Page components for each feature
   - Component files for UI elements
   - API client service
   - Routing configuration
   - Package.json or equivalent

3. DATABASE FILES:
   - Schema definition
   - Migration files (if applicable)

4. ROOT FILES:
   - README.md with setup instructions
   - .gitignore
   - Docker files (if applicable)
   - Environment file templates

RULES:
- Use appropriate file extensions for the chosen tech stack
- Organize files in logical directories
- Each file should have ONE clear purpose
- Match the project requirements exactly
- Return valid JSON only"""
    
    def _get_fallback_blueprint(self, tech_stack: str) -> Dict[str, Any]:
        """Return a minimal fallback blueprint if AI fails."""
        return {
            "frontend": {
                "framework": "React" if "React" in tech_stack else "Unknown",
                "files": {
                    "src/App.tsx": "Main application component",
                    "src/index.tsx": "Application entry point",
                    "package.json": "Dependencies and scripts",
                    "README.md": "Frontend setup instructions"
                }
            },
            "backend": {
                "framework": "FastAPI" if "FastAPI" in tech_stack else "Unknown",
                "files": {
                    "main.py": "FastAPI application entry point",
                    "requirements.txt": "Python dependencies",
                    "README.md": "Backend setup instructions"
                }
            },
            "database": {
                "files": {
                    "schema.sql": "Database schema definition"
                }
            },
            "root": {
                "files": {
                    "README.md": "Project documentation",
                    ".gitignore": "Git ignore patterns"
                }
            }
        }


# Global planner instance
def get_ai_planner() -> AIProjectPlanner:
    """Get or create AI planner instance."""
    return AIProjectPlanner()
