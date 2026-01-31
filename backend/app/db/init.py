"""
Tortoise ORM initialization and configuration.
"""
from tortoise import Tortoise
from app.config import settings
from urllib.parse import urlparse, parse_qs, urlencode, urlunparse


def get_db_url() -> str:
    """
    Get database URL and ensure it uses the correct scheme for Tortoise ORM.
    Tortoise ORM requires 'postgres://' instead of 'postgresql://'.
    Also converts sslmode to ssl parameter for asyncpg compatibility.
    Strips unsupported parameters like channel_binding.
    """
    db_url = settings.database_url
    
    # Replace postgresql:// with postgres:// for Tortoise ORM compatibility
    if db_url.startswith("postgresql://"):
        db_url = db_url.replace("postgresql://", "postgres://", 1)
    
    # Parse URL to handle SSL parameters
    parsed = urlparse(db_url)
    
    # Parse query parameters
    query_params = parse_qs(parsed.query)
    
    # Parameters supported by asyncpg
    supported_params = {
        'ssl', 'timeout', 'command_timeout', 'server_settings',
        'max_cacheable_statement_size', 'max_cached_statement_lifetime'
    }
    
    # Check if sslmode needs conversion
    needs_ssl = False
    if 'sslmode' in query_params:
        sslmode = query_params['sslmode'][0]
        if sslmode in ('require', 'verify-ca', 'verify-full'):
            needs_ssl = True
    
    # Filter out unsupported parameters
    filtered_params = {
        k: v for k, v in query_params.items() 
        if k in supported_params
    }
    
    # Add ssl if needed
    if needs_ssl and 'ssl' not in filtered_params:
        filtered_params['ssl'] = ['true']
    
    # Reconstruct query string
    new_query = urlencode(filtered_params, doseq=True) if filtered_params else ''
    
    # Reconstruct URL
    new_parsed = parsed._replace(query=new_query)
    return urlunparse(new_parsed)


TORTOISE_ORM = {
    "connections": {
        "default": get_db_url()
    },
    "apps": {
        "models": {
            "models": ["app.db.models", "aerich.models"],
            "default_connection": "default",
        },
    },
    "use_tz": False,
    "timezone": "UTC",
}


async def init_db():
    """Initialize Tortoise ORM and create database tables."""
    await Tortoise.init(
        db_url=get_db_url(),
        modules={"models": ["app.db.models"]}
    )
    # Generate schema
    await Tortoise.generate_schemas()


async def close_db():
    """Close database connections."""
    await Tortoise.close_connections()
