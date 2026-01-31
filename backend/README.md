# AutoPilot Project Generator - Backend

Backend API for the AutoPilot project generator built with FastAPI, Tortoise ORM, and PostgreSQL.

## Features

- **FastAPI** with async support
- **Tortoise ORM** for database management
- **PostgreSQL** with JSONB support
- **UUID** primary keys for all models
- Clean, production-ready architecture

## Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI application
│   ├── config.py            # Configuration management
│   ├── db/
│   │   ├── __init__.py
│   │   ├── init.py          # Tortoise ORM initialization
│   │   └── models.py        # Database models
│   └── routes/
│       ├── __init__.py
│       └── projects.py      # Project endpoints
├── requirements.txt
└── .env.example
```

## Database Models

### Project

- Tracks project generation status and metadata
- Status: PENDING | PARSING | GENERATING | DONE | FAILED

### ProjectSpec

- Stores parsed project specifications as JSONB
- Features, APIs, database schema, tech stack

### ProjectFile

- Metadata for generated project files
- File paths, types, and optimization status

### GenerationLog

- Tracks generation steps and messages
- Timestamped logs for debugging

## Setup

1. **Install dependencies:**

   ```bash
   pip install -r requirements.txt
   ```

2. **Configure environment:**

   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

3. **Run the application:**

   ```bash
   uvicorn app.main:app --reload
   ```

   The API will be available at `http://localhost:8000`

## API Endpoints

### Create Project

```bash
POST /projects
Content-Type: application/json

{
  "name": "My Project",
  "tech_stack": "React + Node.js"
}

Response:
{
  "id": "uuid",
  "status": "PENDING",
  "created_at": "2026-02-01T00:00:00"
}
```

### Get Project

```bash
GET /projects/{project_id}

Response: Complete project details
```

### Health Check

```bash
GET /health

Response: {"status": "healthy"}
```

## Environment Variables

- `DATABASE_URL`: PostgreSQL connection string (required)
- `APP_NAME`: Application name (optional)
- `DEBUG`: Debug mode (optional, default: False)

## NeonDB Configuration

For NeonDB, use the following format:

```
DATABASE_URL=postgresql://user:password@ep-xxx-xxx.region.aws.neon.tech/neondb?sslmode=require
```

## Development

The application uses:

- **Pydantic Settings** for configuration management
- **Tortoise ORM** with async PostgreSQL driver (asyncpg)
- **Auto-generated schemas** on startup
- **CORS middleware** for frontend integration

## API Documentation

Once running, visit:

- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`
