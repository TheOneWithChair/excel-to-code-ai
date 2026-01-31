# Storage Directory

This directory stores temporarily uploaded Excel specification files.

## Structure

```
storage/
└── uploads/
    └── {project_id}/
        ├── features.xlsx
        ├── apis.xlsx
        ├── database.xlsx
        └── tech_stack.xlsx
```

## Notes

- Each project gets its own subdirectory using the project UUID
- Files are saved here during the upload-specs endpoint processing
- This directory should be added to `.gitignore` to avoid committing user data
