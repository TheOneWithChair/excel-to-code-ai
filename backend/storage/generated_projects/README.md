# Generated Projects Directory

This directory stores generated project files.

## Structure

```
generated_projects/
└── {project_id}/
    ├── backend/
    │   ├── main.py
    │   └── requirements.txt
    ├── frontend/
    │   └── README.md
    ├── database/
    │   └── schema.sql
    ├── README.md
    └── .gitignore
```

## Notes

- Each project gets its own subdirectory using the project UUID
- Projects are generated based on Excel specifications
- This directory should be added to `.gitignore` to avoid committing generated code
