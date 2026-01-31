"""
AI-powered code generation service using Groq API.
Generates actual code files based on specifications.
"""
import httpx
from typing import Dict, Any, Optional
from app.config import settings


class AICodeGenerator:
    """Generates actual code for project files using AI."""
    
    GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"
    
    def __init__(self):
        """Initialize HTTP client."""
        if not settings.groq_api_key:
            raise ValueError(
                "GROQ_API_KEY is not configured. Please set GROQ_API_KEY in your .env file."
            )
        self.api_key = settings.groq_api_key
        self.model = settings.groq_model
    
    async def generate_file_code(
        self,
        file_path: str,
        file_purpose: str,
        project_name: str,
        framework: str,
        features_json: Dict[str, Any],
        apis_json: Dict[str, Any],
        database_json: Dict[str, Any],
        tech_stack_json: Dict[str, Any],
        related_files: Optional[Dict[str, str]] = None
    ) -> str:
        """
        Generate code for a specific file.
        
        Args:
            file_path: Path of the file to generate (e.g., "src/App.tsx")
            file_purpose: Purpose description from blueprint
            project_name: Name of the project
            framework: Framework being used (e.g., "React", "FastAPI")
            features_json: Features from specs
            apis_json: API definitions from specs
            database_json: Database schema from specs
            tech_stack_json: Tech stack details from specs
            related_files: Dict of related file paths and their purposes
            
        Returns:
            Generated code as string
        """
        prompt = self._build_code_generation_prompt(
            file_path,
            file_purpose,
            project_name,
            framework,
            features_json,
            apis_json,
            database_json,
            tech_stack_json,
            related_files
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
                    "content": """You are a senior software engineer writing production code.

CRITICAL RULES:
1. Return ONLY the code - NO explanations, NO markdown
2. NO code block markers (no ```python, ```typescript, etc.)
3. NO comments explaining what you did
4. Just pure, raw, executable code
5. Code must be production-ready, not a placeholder
6. Follow best practices for the language/framework
7. Include necessary imports and proper structure
8. Match the specifications EXACTLY

Your response should start with the first line of code and end with the last line of code."""
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            "temperature": 0.2,
            "max_tokens": 4096
        }
        
        async with httpx.AsyncClient(timeout=90.0) as client:
            response = await client.post(
                self.GROQ_API_URL,
                headers=headers,
                json=payload
            )
            response.raise_for_status()
            
            result = response.json()
            code = result["choices"][0]["message"]["content"].strip()
            
            # Clean up any markdown that might have slipped through
            if code.startswith("```"):
                # Find the first newline after ```
                first_newline = code.find("\n")
                if first_newline != -1:
                    code = code[first_newline + 1:]
            if code.endswith("```"):
                code = code[:-3]
            
            code = code.strip()
            return code
    
    def _build_code_generation_prompt(
        self,
        file_path: str,
        file_purpose: str,
        project_name: str,
        framework: str,
        features_json: Dict[str, Any],
        apis_json: Dict[str, Any],
        database_json: Dict[str, Any],
        tech_stack_json: Dict[str, Any],
        related_files: Optional[Dict[str, str]]
    ) -> str:
        """Build the prompt for code generation."""
        
        # Determine file type and extract relevant specs
        is_backend = "backend" in file_path or file_path.endswith(".py")
        is_frontend = "frontend" in file_path or file_path.endswith((".tsx", ".ts", ".jsx", ".js"))
        is_database = "database" in file_path or file_path.endswith(".sql")
        is_config = any(name in file_path.lower() for name in ["package.json", "requirements.txt", "config", ".env", "docker"])
        is_readme = file_path.endswith(("README.md", ".md"))
        
        prompt = f"""Generate code for this file:

FILE: {file_path}
PURPOSE: {file_purpose}
PROJECT: {project_name}
FRAMEWORK: {framework}

"""
        
        # Add relevant specs based on file type
        if is_backend or is_frontend:
            prompt += f"""FEATURES TO IMPLEMENT:
{self._format_json_section(features_json)}

"""
        
        if is_backend or file_path.endswith((".py", ".js", ".ts")):
            prompt += f"""API ENDPOINTS:
{self._format_json_section(apis_json)}

"""
        
        if is_database or is_backend:
            prompt += f"""DATABASE SCHEMA:
{self._format_json_section(database_json)}

"""
        
        if is_config or is_readme:
            prompt += f"""TECH STACK:
{self._format_json_section(tech_stack_json)}

"""
        
        if related_files:
            prompt += f"""RELATED FILES IN PROJECT:
{self._format_related_files(related_files)}

"""
        
        # Add specific instructions based on file type
        if is_backend:
            prompt += self._get_backend_instructions()
        elif is_frontend:
            prompt += self._get_frontend_instructions()
        elif is_database:
            prompt += self._get_database_instructions()
        elif is_config:
            prompt += self._get_config_instructions(file_path)
        elif is_readme:
            prompt += self._get_readme_instructions()
        else:
            prompt += "Generate appropriate code for this file type.\n"
        
        prompt += "\nGenerate the COMPLETE, PRODUCTION-READY code now."
        
        return prompt
    
    def _format_json_section(self, data: Dict[str, Any]) -> str:
        """Format JSON data for the prompt."""
        import json
        if not data:
            return "(none specified)"
        return json.dumps(data, indent=2)
    
    def _format_related_files(self, files: Dict[str, str]) -> str:
        """Format related files list."""
        lines = []
        for path, purpose in files.items():
            lines.append(f"- {path}: {purpose}")
        return "\n".join(lines) if lines else "(no related files)"
    
    def _get_backend_instructions(self) -> str:
        """Get instructions for backend files."""
        return """BACKEND FILE INSTRUCTIONS:
- Implement all API endpoints from specs
- Include proper error handling
- Add input validation
- Use async/await patterns
- Include database integration code
- Add authentication if required by specs
- Follow REST/GraphQL best practices
- Include proper typing/type hints
"""
    
    def _get_frontend_instructions(self) -> str:
        """Get instructions for frontend files."""
        return """FRONTEND FILE INSTRUCTIONS:
- Implement all features from specs
- Create proper component structure
- Add API integration
- Include state management
- Add proper TypeScript types
- Include error handling and loading states
- Follow React/Vue/Angular best practices
- Make responsive and accessible
"""
    
    def _get_database_instructions(self) -> str:
        """Get instructions for database files."""
        return """DATABASE FILE INSTRUCTIONS:
- Create all tables from schema specs
- Include proper constraints and indexes
- Add foreign key relationships
- Include sample data if helpful
- Follow SQL best practices
- Support migrations if applicable
"""
    
    def _get_config_instructions(self, file_path: str) -> str:
        """Get instructions for config files."""
        if "package.json" in file_path:
            return """PACKAGE.JSON INSTRUCTIONS:
- Include all necessary dependencies
- Add proper scripts (dev, build, test)
- Set correct version
- Include project metadata
"""
        elif "requirements.txt" in file_path:
            return """REQUIREMENTS.TXT INSTRUCTIONS:
- Include all Python dependencies
- Pin versions for stability
- Organize by category (comments)
- Include only necessary packages
"""
        else:
            return """CONFIG FILE INSTRUCTIONS:
- Include all necessary configuration
- Add comments explaining options
- Use environment variables where appropriate
- Follow best practices for this config type
"""
    
    def _get_readme_instructions(self) -> str:
        """Get instructions for README files."""
        return """README INSTRUCTIONS:
- Explain what the project does
- Include setup instructions
- Add usage examples
- List all features
- Include tech stack details
- Add API documentation if applicable
- Include testing instructions
- Use proper markdown formatting
"""


# Global code generator instance
def get_ai_code_generator() -> AICodeGenerator:
    """Get or create AI code generator instance."""
    return AICodeGenerator()
