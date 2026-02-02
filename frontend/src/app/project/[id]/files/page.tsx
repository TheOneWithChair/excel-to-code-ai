'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { apiClient } from '@/lib/api-client';
import type { FileTreeNode, FileContentResponse, OptimizeFilesResponse } from '@/types/api';
import ProjectTree, { FileNode } from '@/components/ProjectTree';

interface ProjectFilesPageProps {
    params: Promise<{
        id: string;
    }>;
}

// Mock file structure with content
const mockProjectStructure: FileNode[] = [
    {
        id: 'src',
        name: 'src',
        type: 'folder',
        path: '/src',
        children: [
            {
                id: 'src/app.ts',
                name: 'app.ts',
                type: 'file',
                path: '/src/app.ts',
                content: `import express from 'express';
import cors from 'cors';
import routes from './routes';
import { errorHandler } from './middleware/errorHandler';
import { logger } from './utils/logger';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', routes);

// Error handling
app.use(errorHandler);

app.listen(PORT, () => {
    logger.info(\`Server running on port \${PORT}\`);
});

export default app;`
            },
            {
                id: 'src/controllers',
                name: 'controllers',
                type: 'folder',
                path: '/src/controllers',
                children: [
                    {
                        id: 'src/controllers/userController.ts',
                        name: 'userController.ts',
                        type: 'file',
                        path: '/src/controllers/userController.ts',
                        content: `import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/userService';
import { ApiError } from '../utils/apiError';

export class UserController {
    private userService: UserService;

    constructor() {
        this.userService = new UserService();
    }

    async getAllUsers(req: Request, res: Response, next: NextFunction) {
        try {
            const users = await this.userService.findAll();
            res.json({
                success: true,
                data: users
            });
        } catch (error) {
            next(error);
        }
    }

    async getUserById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const user = await this.userService.findById(id);
            
            if (!user) {
                throw new ApiError(404, 'User not found');
            }

            res.json({
                success: true,
                data: user
            });
        } catch (error) {
            next(error);
        }
    }

    async createUser(req: Request, res: Response, next: NextFunction) {
        try {
            const userData = req.body;
            const user = await this.userService.create(userData);
            
            res.status(201).json({
                success: true,
                data: user
            });
        } catch (error) {
            next(error);
        }
    }
}`
                    },
                    {
                        id: 'src/controllers/productController.ts',
                        name: 'productController.ts',
                        type: 'file',
                        path: '/src/controllers/productController.ts',
                        content: `import { Request, Response, NextFunction } from 'express';
import { ProductService } from '../services/productService';
import { ApiError } from '../utils/apiError';

export class ProductController {
    private productService: ProductService;

    constructor() {
        this.productService = new ProductService();
    }

    async getAllProducts(req: Request, res: Response, next: NextFunction) {
        try {
            const { page = 1, limit = 10, category } = req.query;
            const products = await this.productService.findAll({
                page: Number(page),
                limit: Number(limit),
                category: category as string
            });
            
            res.json({
                success: true,
                data: products
            });
        } catch (error) {
            next(error);
        }
    }
}`
                    }
                ]
            },
            {
                id: 'src/models',
                name: 'models',
                type: 'folder',
                path: '/src/models',
                children: [
                    {
                        id: 'src/models/User.ts',
                        name: 'User.ts',
                        type: 'file',
                        path: '/src/models/User.ts',
                        content: `import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
    email: string;
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    role: 'user' | 'admin';
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const userSchema = new Schema<IUser>({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

export const User = model<IUser>('User', userSchema);`
                    }
                ]
            },
            {
                id: 'src/routes',
                name: 'routes',
                type: 'folder',
                path: '/src/routes',
                children: [
                    {
                        id: 'src/routes/index.ts',
                        name: 'index.ts',
                        type: 'file',
                        path: '/src/routes/index.ts',
                        content: `import { Router } from 'express';
import userRoutes from './userRoutes';
import productRoutes from './productRoutes';

const router = Router();

router.use('/users', userRoutes);
router.use('/products', productRoutes);

export default router;`
                    }
                ]
            }
        ]
    },
    {
        id: 'config',
        name: 'config',
        type: 'folder',
        path: '/config',
        children: [
            {
                id: 'config/database.ts',
                name: 'database.ts',
                type: 'file',
                path: '/config/database.ts',
                content: `import mongoose from 'mongoose';
import { logger } from '../src/utils/logger';

export const connectDatabase = async (): Promise<void> => {
    try {
        const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/myapp';
        
        await mongoose.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        logger.info('Database connected successfully');
    } catch (error) {
        logger.error('Database connection failed:', error);
        process.exit(1);
    }
};`
            }
        ]
    },
    {
        id: 'package.json',
        name: 'package.json',
        type: 'file',
        path: '/package.json',
        content: `{
  "name": "ecommerce-platform",
  "version": "1.0.0",
  "description": "Full-stack e-commerce platform",
  "main": "dist/app.js",
  "scripts": {
    "start": "node dist/app.js",
    "dev": "ts-node-dev --respawn src/app.ts",
    "build": "tsc",
    "test": "jest"
  },
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^7.0.3",
    "cors": "^2.8.5",
    "dotenv": "^16.0.3"
  },
  "devDependencies": {
    "@types/express": "^4.17.17",
    "@types/node": "^18.15.11",
    "typescript": "^5.0.4",
    "ts-node-dev": "^2.0.0"
  }
}`
    },
    {
        id: 'README.md',
        name: 'README.md',
        type: 'file',
        path: '/README.md',
        content: `# E-Commerce Platform

Auto-generated by AutoPilot from Excel templates.

## Features

- User authentication and authorization
- Product catalog management
- Shopping cart functionality
- Order processing
- Admin dashboard

## Tech Stack

- **Backend**: Node.js, Express, TypeScript
- **Database**: MongoDB with Mongoose
- **API**: RESTful architecture

## Getting Started

1. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

2. Configure environment variables:
   \`\`\`bash
   cp .env.example .env
   \`\`\`

3. Start development server:
   \`\`\`bash
   npm run dev
   \`\`\`

## Project Structure

- \`/src\` - Application source code
- \`/config\` - Configuration files
- \`/dist\` - Compiled output

## License

MIT`
    }
];

export default function ProjectFilesPage({ params }: ProjectFilesPageProps) {
    const { id } = use(params);
    const router = useRouter();
    const [fileTree, setFileTree] = useState<FileTreeNode[] | null>(null);
    const [selectedFile, setSelectedFile] = useState<string | null>(null);
    const [fileContent, setFileContent] = useState<string>('');
    const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
    const [isLoadingTree, setIsLoadingTree] = useState(true);
    const [isLoadingContent, setIsLoadingContent] = useState(false);
    const [isOptimizing, setIsOptimizing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [optimizationResults, setOptimizationResults] = useState<string | null>(null);
    const [customInstructions, setCustomInstructions] = useState<string>('');

    // Fetch file tree on mount
    useEffect(() => {
        const fetchFileTree = async () => {
            try {
                setIsLoadingTree(true);
                setError(null);
                const data = await apiClient.getFiles(id);
                console.log('File tree response:', data);
                console.log('File tree type:', typeof data, Array.isArray(data));
                setFileTree(Array.isArray(data) ? data : [data]);
            } catch (err) {
                console.error('Error fetching file tree:', err);
                setError(err instanceof Error ? err.message : 'Failed to load files');
            } finally {
                setIsLoadingTree(false);
            }
        };

        fetchFileTree();
    }, [id]);

    // Fetch file content when a file is selected
    const handleFileClick = async (filePath: string) => {
        try {
            setIsLoadingContent(true);
            setError(null);
            setSelectedFile(filePath);
            const data: FileContentResponse = await apiClient.getFileContent(id, filePath);
            setFileContent(data.content);
        } catch (err) {
            console.error('Error fetching file content:', err);
            setError(err instanceof Error ? err.message : 'Failed to load file content');
            setFileContent('');
        } finally {
            setIsLoadingContent(false);
        }
    };

    // Toggle file selection
    const handleFileSelect = (id: string, checked: boolean) => {
        setSelectedFiles(prev => {
            const next = new Set(prev);
            if (checked) {
                next.add(id);
            } else {
                next.delete(id);
            }
            return next;
        });
    };

    // Collect all mapped file IDs from a node recursively
    const collectFilesFromNode = (node: FileNode): string[] => {
        const ids: string[] = [];

        if (node.type === 'file') {
            ids.push(node.id);
        }

        if (node.children) {
            for (const child of node.children) {
                ids.push(...collectFilesFromNode(child));
            }
        }

        return ids;
    };

    // Toggle folder selection (selects/deselects all files within)
    const handleFolderSelect = (node: FileNode, checked: boolean) => {
        const fileIds = collectFilesFromNode(node);
        setSelectedFiles(prev => {
            const next = new Set(prev);
            if (checked) {
                fileIds.forEach(id => next.add(id));
            } else {
                fileIds.forEach(id => next.delete(id));
            }
            return next;
        });
    };

    // Check if node is fully selected, partially selected, or not selected
    const getNodeSelectionState = (node: FileNode): 'all' | 'some' | 'none' => {
        if (node.type === 'file') {
            return selectedFiles.has(node.id) ? 'all' : 'none';
        }

        const fileIds = collectFilesFromNode(node);
        if (fileIds.length === 0) return 'none';

        const selectedCount = fileIds.filter(id => selectedFiles.has(id)).length;

        if (selectedCount === 0) return 'none';
        if (selectedCount === fileIds.length) return 'all';
        return 'some';
    };

    // Optimize selected files
    const handleOptimize = async () => {
        if (selectedFiles.size === 0) {
            setError('Please select at least one file to optimize');
            return;
        }

        try {
            setIsOptimizing(true);
            setError(null);
            setOptimizationResults(null);

            const files = Array.from(selectedFiles);
            console.log('Optimizing files:', files);
            console.log('Custom instructions:', customInstructions);
            const response: OptimizeFilesResponse = await apiClient.optimizeFiles(id, files, customInstructions);
            console.log('Optimization response:', response);

            // Check if response has optimized array
            if (!response.optimized || !Array.isArray(response.optimized)) {
                throw new Error('Invalid response format from optimization API');
            }

            // Build results message
            const results = response.optimized
                .map((result) => `${result.path}: ${result.success ? '✓ Success' : '✗ Failed'} - ${result.message}`)
                .join('\n');

            setOptimizationResults(results);

            // Refresh file tree to pick up any renamed files
            try {
                const treeData = await apiClient.getFiles(id);
                setFileTree(Array.isArray(treeData) ? treeData : [treeData]);
            } catch (treeErr) {
                console.error('Error refreshing file tree:', treeErr);
            }

            // Clear current selection and file content since paths may have changed
            setSelectedFile(null);
            setFileContent('');
            setSelectedFiles(new Set());
        } catch (err) {
            console.error('Error optimizing files:', err);
            setError(err instanceof Error ? err.message : 'Failed to optimize files');
        } finally {
            setIsOptimizing(false);
        }
    };

    // Map FileTreeNode (API) to FileNode (Component)
    const mapApiNodesToTreeNodes = (nodes: FileTreeNode[], parentPath: string = ''): FileNode[] => {
        return nodes.map((node) => {
            const currentPath = node.path || (parentPath ? `${parentPath}/${node.name}` : node.name);
            return {
                id: currentPath,
                name: node.name,
                type: node.type as 'file' | 'folder' | 'directory',
                path: currentPath,
                children: node.children ? mapApiNodesToTreeNodes(node.children, currentPath) : undefined,
            };
        });
    };

    const treeData = fileTree ? mapApiNodesToTreeNodes(fileTree) : [];

    if (isLoadingTree) {
        return (
            <div className="min-h-screen bg-gray-50">
                <header className="bg-white border-b border-gray-200">
                    <div className="container mx-auto px-6 py-4">
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-blue-600 rounded"></div>
                            <span className="text-xl font-semibold">AutoPilot</span>
                        </div>
                    </div>
                </header>
                <main className="container mx-auto px-6 py-8">
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading files...</p>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-blue-600 rounded"></div>
                            <span className="text-xl font-semibold">AutoPilot</span>
                        </div>
                        <Button variant="secondary" onClick={() => router.push(`/project/${id}/status`)}>
                            Back to Status
                        </Button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-6 py-8 max-w-7xl">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Project Files</h1>

                {/* Error Message */}
                {error && (
                    <Card className="mb-6 bg-red-50 border-red-200">
                        <p className="text-red-800">{error}</p>
                    </Card>
                )}

                {/* Optimization Results */}
                {optimizationResults && (
                    <Card className="mb-6 bg-green-50 border-green-200">
                        <h3 className="text-lg font-semibold text-green-900 mb-2">Optimization Results</h3>
                        <pre className="text-sm text-green-800 whitespace-pre-wrap font-mono">
                            {optimizationResults}
                        </pre>
                    </Card>
                )}

                {/* Action Bar */}
                <Card className="mb-6">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-600">
                                {selectedFiles.size > 0 ? (
                                    <span>{selectedFiles.size} file{selectedFiles.size > 1 ? 's' : ''} selected</span>
                                ) : (
                                    <span>Select files to optimize</span>
                                )}
                            </div>
                            <Button
                                onClick={handleOptimize}
                                disabled={selectedFiles.size === 0 || isOptimizing}
                            >
                                {isOptimizing ? 'Optimizing...' : 'Optimize Selected'}
                            </Button>
                        </div>

                        {/* Custom Instructions */}
                        <div>
                            <label htmlFor="custom-instructions" className="block text-sm font-medium text-gray-700 mb-2">
                                Custom Optimization Instructions (Optional)
                            </label>
                            <textarea
                                id="custom-instructions"
                                value={customInstructions}
                                onChange={(e) => setCustomInstructions(e.target.value)}
                                placeholder="e.g., Add more error handling, improve performance, add TypeScript types, etc."
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                                rows={3}
                                disabled={isOptimizing}
                            />
                            <p className="mt-1 text-xs text-gray-500">
                                Provide specific improvements you want. If left empty, files will be optimized with general best practices.
                            </p>
                        </div>
                    </div>
                </Card>

                {/* Two-column layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* File Tree */}
                    <Card className="flex flex-col h-full border-0 shadow-none">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 px-1">File Explorer</h2>
                        <div className="flex-1 overflow-auto min-h-[400px]">
                            {fileTree && fileTree.length > 0 ? (
                                <ProjectTree
                                    tree={treeData}
                                    selectedFile={selectedFile}
                                    selectedForOptimization={(() => {
                                        const displaySet = new Set(selectedFiles);
                                        const addFolders = (nodes: FileNode[]) => {
                                            nodes.forEach(node => {
                                                if (node.type !== 'file') {
                                                    const state = getNodeSelectionState(node);
                                                    if (state === 'all') {
                                                        displaySet.add(node.id);
                                                    }
                                                    if (node.children) addFolders(node.children);
                                                }
                                            });
                                        };
                                        addFolders(treeData);
                                        return displaySet;
                                    })()}
                                    onFileSelect={(node) => handleFileClick(node.path)}
                                    onToggleOptimization={(id) => {
                                        // Find node in the MAPPED tree (treeData)
                                        // This tree already has correctly constructed currentPath/id
                                        const findInTree = (nodes: FileNode[], targetId: string): FileNode | undefined => {
                                            for (const node of nodes) {
                                                if (node.id === targetId) return node;
                                                if (node.children) {
                                                    const found = findInTree(node.children, targetId);
                                                    if (found) return found;
                                                }
                                            }
                                            return undefined;
                                        };

                                        const node = findInTree(treeData, id);
                                        if (node) {
                                            if (node.type === 'file') {
                                                const isChecked = selectedFiles.has(id);
                                                handleFileSelect(id, !isChecked);
                                            } else {
                                                const state = getNodeSelectionState(node);
                                                const shouldCheck = state !== 'all';
                                                handleFolderSelect(node, shouldCheck);
                                            }
                                        }
                                    }}
                                    className="border-0 shadow-none"
                                />
                            ) : (
                                <p className="text-gray-500 px-1">No files found</p>
                            )}
                        </div>
                    </Card>

                    {/* File Content Viewer */}
                    <Card>
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">
                            {selectedFile ? selectedFile : 'File Content'}
                        </h2>
                        {isLoadingContent ? (
                            <div className="flex items-center justify-center py-12">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            </div>
                        ) : selectedFile ? (
                            <div className="max-h-[600px] overflow-auto bg-gray-50 rounded p-4">
                                <pre className="text-sm font-mono whitespace-pre-wrap">{fileContent}</pre>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center py-12 text-gray-500">
                                Select a file to view its content
                            </div>
                        )}
                    </Card>
                </div>
            </main>
        </div>
    );
}
