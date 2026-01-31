// API Client for AutoPilot Backend
import type {
  CreateProjectRequest,
  CreateProjectResponse,
  Project,
  UploadSpecsResponse,
  FileTreeNode,
  FileContentResponse,
  OptimizeFilesRequest,
  OptimizeFilesResponse,
  ApiError,
} from "@/types/api";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  /**
   * Create a new project
   */
  async createProject(
    data: CreateProjectRequest,
  ): Promise<CreateProjectResponse> {
    const response = await fetch(`${this.baseUrl}/projects`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(error.detail || "Failed to create project");
    }

    return response.json();
  }

  /**
   * Get project details by ID
   */
  async getProject(projectId: string): Promise<Project> {
    const response = await fetch(`${this.baseUrl}/projects/${projectId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(error.detail || "Failed to fetch project");
    }

    return response.json();
  }

  /**
   * Upload Excel specification files
   */
  async uploadSpecs(
    projectId: string,
    files: {
      features?: File;
      apis?: File;
      database?: File;
      tech_stack?: File;
    },
  ): Promise<UploadSpecsResponse> {
    const formData = new FormData();

    if (files.features) {
      formData.append("features", files.features);
    }
    if (files.apis) {
      formData.append("apis", files.apis);
    }
    if (files.database) {
      formData.append("database", files.database);
    }
    if (files.tech_stack) {
      formData.append("tech_stack", files.tech_stack);
    }

    const response = await fetch(
      `${this.baseUrl}/projects/${projectId}/upload-specs`,
      {
        method: "POST",
        body: formData,
      },
    );

    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(error.detail || "Failed to upload specifications");
    }

    return response.json();
  }

  /**
   * Trigger project generation
   */
  async generateProject(
    projectId: string,
  ): Promise<{ message: string; project_id: string }> {
    const response = await fetch(
      `${this.baseUrl}/projects/${projectId}/generate`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(error.detail || "Failed to start project generation");
    }

    return response.json();
  }

  /**
   * Get project file tree
   */
  async getFiles(projectId: string): Promise<FileTreeNode> {
    const response = await fetch(
      `${this.baseUrl}/projects/${projectId}/files`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(error.detail || "Failed to fetch files");
    }

    return response.json();
  }

  /**
   * Get file content
   */
  async getFileContent(
    projectId: string,
    filePath: string,
  ): Promise<FileContentResponse> {
    const response = await fetch(
      `${this.baseUrl}/projects/${projectId}/files/content?path=${encodeURIComponent(filePath)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(error.detail || "Failed to fetch file content");
    }

    return response.json();
  }

  /**
   * Optimize selected files using AI
   */
  async optimizeFiles(
    projectId: string,
    files: string[],
  ): Promise<OptimizeFilesResponse> {
    const response = await fetch(
      `${this.baseUrl}/projects/${projectId}/optimize`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ files }),
      },
    );

    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(error.detail || "Failed to optimize files");
    }

    return response.json();
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<{ status: string }> {
    const response = await fetch(`${this.baseUrl}/health`);
    return response.json();
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Export class for custom instances
export default ApiClient;
