'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { apiClient } from '@/lib/api-client';
import type { FileTreeNode, FileContentResponse, OptimizeFilesResponse } from '@/types/api';

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
    const [fileTree, setFileTree] = useState<FileTreeNode | null>(null);
    const [selectedFile, setSelectedFile] = useState<string | null>(null);
    const [fileContent, setFileContent] = useState<string>('');
    const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
    const [isLoadingTree, setIsLoadingTree] = useState(true);
    const [isLoadingContent, setIsLoadingContent] = useState(false);
    const [isOptimizing, setIsOptimizing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [optimizationResults, setOptimizationResults] = useState<string | null>(null);

    // Fetch file tree on mount
    useEffect(() => {
        const fetchFileTree = async () => {
            try {
                setIsLoadingTree(true);
                setError(null);
                const data = await apiClient.getFiles(id);
                setFileTree(data);
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
    const handleFileSelect = (filePath: string, checked: boolean) => {
        const newSelected = new Set(selectedFiles);
        if (checked) {
            newSelected.add(filePath);
        } else {
            newSelected.delete(filePath);
        }
        setSelectedFiles(newSelected);
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
            const response: OptimizeFilesResponse = await apiClient.optimizeFiles(id, files);

            // Build results message
            const results = Object.entries(response.results)
                .map(([path, result]) => `${path}: ${result.success ? '✓ Success' : '✗ Failed'} - ${result.message}`)
                .join('\n');

            setOptimizationResults(results);

            // Refresh file content if current file was optimized
            if (selectedFile && selectedFiles.has(selectedFile)) {
                const data: FileContentResponse = await apiClient.getFileContent(id, selectedFile);
                setFileContent(data.content);
            }

            // Clear selection
            setSelectedFiles(new Set());
        } catch (err) {
            console.error('Error optimizing files:', err);
            setError(err instanceof Error ? err.message : 'Failed to optimize files');
        } finally {
            setIsOptimizing(false);
        }
    };

    // Render file tree recursively
    const renderFileTree = (node: FileTreeNode, depth: number = 0) => {
        const isFile = node.type === 'file';
        const isSelected = selectedFiles.has(node.path);
        const isCurrentFile = selectedFile === node.path;

        return (
            <div key={node.path} style={{ marginLeft: `${depth * 20}px` }}>
                <div
                    className={`flex items-center gap-2 py-1.5 px-2 rounded cursor-pointer hover:bg-gray-100 ${isCurrentFile ? 'bg-blue-50' : ''
                        }`}
                >
                    {isFile && (
                        <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => handleFileSelect(node.path, e.target.checked)}
                            onClick={(e) => e.stopPropagation()}
                            className="w-4 h-4"
                        />
                    )}
                    <div
                        className="flex items-center gap-2 flex-1"
                        onClick={() => isFile && handleFileClick(node.path)}
                    >
                        {isFile ? (
                            <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                            </svg>
                        ) : (
                            <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                            </svg>
                        )}
                        <span className={`text-sm ${isFile ? 'text-gray-700' : 'font-semibold text-gray-900'}`}>
                            {node.name}
                        </span>
                    </div>
                </div>
                {node.children && node.children.map((child) => renderFileTree(child, depth + 1))}
            </div>
        );
    };

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
                </Card>

                {/* Two-column layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* File Tree */}
                    <Card>
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">File Explorer</h2>
                        <div className="max-h-[600px] overflow-y-auto">
                            {fileTree ? renderFileTree(fileTree) : <p className="text-gray-500">No files found</p>}
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
