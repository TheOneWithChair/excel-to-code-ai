# Frontend - Backend Integration

The frontend is now fully integrated with the AutoPilot backend API.

## Setup

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Configure environment:**

   ```bash
   cp .env.example .env.local
   # The default API URL is http://localhost:8000
   ```

3. **Start development server:**

   ```bash
   npm run dev
   ```

   Frontend will run on `http://localhost:3000`

## Integration Features

### API Client (`src/lib/api-client.ts`)

Centralized HTTP client for all backend communication:

- `createProject()` - Create new project
- `getProject()` - Fetch project details
- `uploadSpecs()` - Upload Excel specifications
- `healthCheck()` - Backend health check

### Type Definitions (`src/types/api.ts`)

TypeScript types matching backend models:

- `Project` - Project entity
- `CreateProjectRequest` - Create project payload
- `CreateProjectResponse` - Create project response
- `UploadSpecsResponse` - Upload response
- `ApiError` - Error response

### Dashboard Page (`src/app/dashboard/page.tsx`)

Complete workflow implementation:

1. **Project Creation**
   - User enters project name
   - System creates project via API with PENDING status

2. **File Upload**
   - Upload features.xlsx, apis.xlsx, database.xlsx, tech_stack.xlsx
   - Files sent to backend via multipart/form-data
   - Backend parses Excel and stores in database

3. **Navigation**
   - After successful upload, redirects to project status page
   - Shows loading states and error messages

### Project Status Page (`src/app/project/[id]/status/page.tsx`)

Real-time project monitoring:

- Fetches project data from backend
- Maps backend status to frontend UI:
  - `PENDING` → "uploaded"
  - `PARSING` → "parsing"
  - `GENERATING` → "generating"
  - `DONE` → "ready"
  - `FAILED` → "error"
- Polls backend every 5 seconds for updates
- Shows current step and progress

## API Workflow

```
User Action                Backend API                     Status Update
───────────────────────────────────────────────────────────────────────────
1. Fill form              →
2. Select Excel files     →
3. Click "Generate"       → POST /projects                  PENDING
                          ← {id, status, created_at}
4. Upload files           → POST /projects/{id}/upload-specs PARSING
                          ← {project_id, message, files}
5. View status            → GET /projects/{id}              PENDING/PARSING/DONE
                          ← {full project data}
6. Poll for updates       → GET /projects/{id} (every 5s)   (Status updates)
```

## Environment Variables

### Frontend (`.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Backend (`backend/.env`)

```env
DATABASE_URL=postgresql://user:pass@host/db
```

## Running Full Stack

### Terminal 1 - Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Backend runs on http://localhost:8000

### Terminal 2 - Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on http://localhost:3000

## Testing the Integration

1. **Visit Dashboard**
   - Navigate to http://localhost:3000/dashboard

2. **Create Project**
   - Enter project name: "My Test Project"
   - Upload Excel files (features, apis, database, tech_stack)
   - Click "Generate Project"

3. **Monitor Progress**
   - System redirects to `/project/{id}/status`
   - Watch real-time status updates
   - Status changes: uploaded → parsing → generating → ready

4. **Verify Backend**
   - Check API docs: http://localhost:8000/docs
   - View project data: `GET /projects/{id}`
   - Check database for stored specs

## API Documentation

Backend provides interactive API documentation:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## Error Handling

The frontend handles various error scenarios:

- **Network errors**: Shows connection error message
- **Validation errors**: Displays field-specific errors
- **Upload errors**: Shows which files failed
- **Backend errors**: Displays error from API response

All errors are user-friendly and actionable.

## CORS Configuration

The backend is configured to allow requests from the frontend:

```python
# backend/app/main.py
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

For production, restrict `allow_origins` to your frontend domain.
