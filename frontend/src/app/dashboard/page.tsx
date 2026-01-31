'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Card from '@/components/Card';
import Button from '@/components/Button';
import FileUploadCard from '@/components/FileUploadCard';

interface UploadedFiles {
    features: File | null;
    apis: File | null;
    database: File | null;
    techStack: File | null;
}

export default function Dashboard() {
    const [projectName, setProjectName] = useState('');
    const [projectDescription, setProjectDescription] = useState('');
    const [uploadedFiles, setUploadedFiles] = useState<UploadedFiles>({
        features: null,
        apis: null,
        database: null,
        techStack: null
    });

    const handleFileSelect = (fileType: keyof UploadedFiles, file: File) => {
        setUploadedFiles(prev => ({
            ...prev,
            [fileType]: file
        }));
    };

    const allFilesUploaded = Object.values(uploadedFiles).every(file => file !== null);
    const isProjectNameValid = projectName.trim().length > 0;

    const handleUploadAndValidate = () => {
        // Placeholder for future API call
        console.log('Upload and Validate:', {
            projectName,
            projectDescription,
            files: uploadedFiles
        });
        alert('Files validation will be implemented with backend integration');
    };

    const handleGenerateProject = () => {
        // Placeholder for future API call
        console.log('Generate Project:', {
            projectName,
            projectDescription,
            files: uploadedFiles
        });
        alert('Project generation will be implemented with backend integration');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <Link href="/" className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-blue-600 rounded"></div>
                        <span className="text-xl font-semibold">AutoPilot</span>
                    </Link>
                    <Link href="/" className="text-sm text-gray-600 hover:text-gray-900">
                        ← Back to Home
                    </Link>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-6 py-8 max-w-5xl">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Project Dashboard</h1>
                    <p className="text-gray-600">Configure your project and upload Excel templates to generate code</p>
                </div>

                <div className="space-y-6">
                    {/* Project Info Section */}
                    <Card title="Project Information" description="Basic details about your project">
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="projectName" className="block text-sm font-medium text-gray-900 mb-2">
                                    Project Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="projectName"
                                    value={projectName}
                                    onChange={(e) => setProjectName(e.target.value)}
                                    placeholder="my-awesome-project"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="projectDescription" className="block text-sm font-medium text-gray-900 mb-2">
                                    Project Description <span className="text-gray-400">(Optional)</span>
                                </label>
                                <textarea
                                    id="projectDescription"
                                    value={projectDescription}
                                    onChange={(e) => setProjectDescription(e.target.value)}
                                    placeholder="A brief description of what your project does..."
                                    rows={3}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                />
                            </div>
                        </div>
                    </Card>

                    {/* Excel Upload Section */}
                    <Card title="Excel Templates" description="Upload your Excel files to define the project structure">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FileUploadCard
                                label="Features Template"
                                fileName="features.xlsx"
                                description="Define app features and components"
                                onFileSelect={(file) => handleFileSelect('features', file)}
                            />
                            <FileUploadCard
                                label="APIs Template"
                                fileName="apis.xlsx"
                                description="Specify API endpoints and routes"
                                onFileSelect={(file) => handleFileSelect('apis', file)}
                            />
                            <FileUploadCard
                                label="Database Template"
                                fileName="database.xlsx"
                                description="Define database schema and models"
                                onFileSelect={(file) => handleFileSelect('database', file)}
                            />
                            <FileUploadCard
                                label="Tech Stack Template (Required)"
                                fileName="tech_stack.xlsx"
                                description="Defines frontend, backend, database, and project configuration"
                                onFileSelect={(file) => handleFileSelect('techStack', file)}
                            />
                        </div>
                    </Card>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-end">
                        <Button
                            variant="secondary"
                            onClick={handleUploadAndValidate}
                            disabled={!allFilesUploaded || !isProjectNameValid}
                        >
                            Upload & Validate
                        </Button>
                        <Button
                            variant="primary"
                            onClick={handleGenerateProject}
                            disabled={!allFilesUploaded || !isProjectNameValid}
                        >
                            Generate Project
                        </Button>
                    </div>

                    {/* Status Message */}
                    {(!allFilesUploaded || !isProjectNameValid) && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <p className="text-sm text-blue-800">
                                {!isProjectNameValid && '📝 Please enter a project name. '}
                                {!allFilesUploaded && '📁 Please upload all required Excel templates to continue.'}
                            </p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
