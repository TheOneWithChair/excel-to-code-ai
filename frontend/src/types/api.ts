// API Types for AutoPilot Backend Integration

export interface Project {
  id: string;
  name: string;
  tech_stack: string;
  status: "PENDING" | "PARSING" | "GENERATING" | "DONE" | "FAILED";
  current_step: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateProjectRequest {
  name: string;
  tech_stack: string;
}

export interface CreateProjectResponse {
  id: string;
  status: string;
  created_at: string;
}

export interface UploadSpecsResponse {
  project_id: string;
  status: string;
  message: string;
  uploaded_files: string[];
}

export interface FileTreeNode {
  name: string;
  path: string;
  type: "file" | "directory";
  children?: FileTreeNode[];
}

export interface FileContentResponse {
  project_id: string;
  file_path: string;
  content: string;
}

export interface OptimizeFilesRequest {
  files: string[];
}

export interface OptimizeFilesResponse {
  project_id: string;
  results: {
    [filePath: string]: {
      success: boolean;
      message: string;
    };
  };
}

export interface ApiError {
  detail: string;
}
