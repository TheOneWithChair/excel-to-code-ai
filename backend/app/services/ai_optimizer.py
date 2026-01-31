"""
AI-powered code optimization service using Groq API via direct HTTP calls.
"""
import httpx
from app.config import settings


class AIOptimizerService:
    """Handles AI-powered code optimization using Groq REST API."""
    
    GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"
    
    def __init__(self):
        """Initialize HTTP client."""
        if not settings.groq_api_key:
            raise ValueError(
                "GROQ_API_KEY is not configured. Please set GROQ_API_KEY in your .env file to use AI optimization."
            )
        self.api_key = settings.groq_api_key
        self.model = settings.groq_model
    
    async def optimize_code(self, prompt: str) -> str:
        """
        Optimize code using Groq AI via direct HTTP request.
        
        Args:
            prompt: The prompt containing code to optimize
            
        Returns:
            Optimized code as plain text
        """
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "model": self.model,
            "messages": [
                {
                    "role": "system",
                    "content": "You are a senior software engineer. You improve code quality, performance, and maintainability. Return ONLY the optimized code without any explanations, markdown formatting, or code blocks. Just the raw code."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            "temperature": 0.2
        }
        
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    self.GROQ_API_URL,
                    json=payload,
                    headers=headers,
                    timeout=60.0
                )
                
                if response.status_code != 200:
                    error_text = response.text
                    raise Exception(f"Groq API error (status {response.status_code}): {error_text}")
                
                result = response.json()
                optimized_code = result["choices"][0]["message"]["content"]
                
                # Remove markdown code blocks if present
                if optimized_code.startswith("```"):
                    lines = optimized_code.split("\n")
                    if lines[0].startswith("```"):
                        lines = lines[1:]
                    if lines and lines[-1].strip() == "```":
                        lines = lines[:-1]
                    optimized_code = "\n".join(lines)
                
                return optimized_code
        
        except httpx.HTTPError as e:
            raise Exception(f"HTTP request failed: {str(e)}")
        except KeyError as e:
            raise Exception(f"Unexpected API response format: missing {str(e)}")
        except Exception as e:
            raise Exception(f"AI optimization failed: {str(e)}")


# Lazy instantiation to avoid startup failures
_ai_optimizer_instance = None

def get_ai_optimizer() -> AIOptimizerService:
    """Get or create AI optimizer instance."""
    global _ai_optimizer_instance
    if _ai_optimizer_instance is None:
        _ai_optimizer_instance = AIOptimizerService()
    return _ai_optimizer_instance
