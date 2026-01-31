'use client';

import React, { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/Button';
import ProjectTree, { FileNode } from '@/components/ProjectTree';
import FileViewer from '@/components/FileViewer';
import OptimizationPanel from '@/components/OptimizationPanel';

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
    const [selectedFile, setSelectedFile] = useState<FileNode | null>(null);
    const [selectedForOptimization, setSelectedForOptimization] = useState<Set<string>>(new Set());

    // Flatten tree to get file names for optimization panel
    const flattenTree = (nodes: FileNode[]): FileNode[] => {
        return nodes.reduce((acc: FileNode[], node) => {
            acc.push(node);
            if (node.children) {
                acc.push(...flattenTree(node.children));
            }
            return acc;
        }, []);
    };

    const allNodes = flattenTree(mockProjectStructure);

    const handleFileSelect = (file: FileNode) => {
        if (file.type === 'file') {
            setSelectedFile(file);
        }
    };

    const handleToggleOptimization = (id: string) => {
        setSelectedForOptimization(prev => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    };

    const handleOptimize = () => {
        const selectedItems = Array.from(selectedForOptimization)
            .map(id => allNodes.find(node => node.id === id)?.path)
            .filter(Boolean);

        alert(`Optimizing ${selectedItems.length} item(s):\n${selectedItems.join('\n')}`);
    };

    const handleRegenerate = () => {
        const selectedItems = Array.from(selectedForOptimization)
            .map(id => allNodes.find(node => node.id === id)?.path)
            .filter(Boolean);

        alert(`Regenerating ${selectedItems.length} module(s):\n${selectedItems.join('\n')}`);
    };

    const selectedItemPaths = Array.from(selectedForOptimization)
        .map(id => allNodes.find(node => node.id === id)?.name || id);

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
                        <div className="flex gap-3">
                            <Button
                                variant="secondary"
                                onClick={() => router.push(`/project/${id}/status`)}
                            >
                                Back to Status
                            </Button>
                            <Button onClick={() => router.push(`/project/${id}/download`)}>
                                Download Project
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-6 py-6">
                {/* Page Title */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Project Files</h1>
                    <p className="text-sm text-gray-600 mt-1">
                        Project ID: <span className="font-mono">{id}</span>
                    </p>
                </div>

                {/* Two Column Layout */}
                <div className="grid grid-cols-12 gap-6">
                    {/* Left Column - Project Tree */}
                    <div className="col-span-3">
                        <ProjectTree
                            tree={mockProjectStructure}
                            selectedFile={selectedFile?.id || null}
                            selectedForOptimization={selectedForOptimization}
                            onFileSelect={handleFileSelect}
                            onToggleOptimization={handleToggleOptimization}
                        />
                    </div>

                    {/* Right Column - File Viewer & Optimization Panel */}
                    <div className="col-span-9 space-y-6">
                        {/* File Viewer */}
                        <FileViewer
                            fileName={selectedFile?.name || null}
                            filePath={selectedFile?.path || null}
                            content={selectedFile?.content || null}
                            className="min-h-125"
                        />

                        {/* Optimization Panel */}
                        <OptimizationPanel
                            selectedCount={selectedForOptimization.size}
                            selectedItems={selectedItemPaths}
                            onOptimize={handleOptimize}
                            onRegenerate={handleRegenerate}
                        />
                    </div>
                </div>
            </main>
        </div>
    );
}
