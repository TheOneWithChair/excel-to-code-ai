'use client';

import React, { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/Card';
import Button from '@/components/Button';
import StatusBadge, { ProjectStatus } from '@/components/StatusBadge';

interface ProjectDownloadPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default function ProjectDownloadPage({ params }: ProjectDownloadPageProps) {
    const { id } = use(params);
    const router = useRouter();
    const [isDownloading, setIsDownloading] = useState(false);

    // Mock project data
    const projectName = 'E-Commerce Platform';
    const projectStatus: ProjectStatus = 'ready';
    const techStack = ['Node.js', 'Express', 'TypeScript', 'MongoDB', 'React', 'Tailwind CSS'];
    const filesGenerated = 127;
    const zipSizeApprox = '2.3 MB';

    const handleDownload = () => {
        setIsDownloading(true);

        // Simulate download delay
        setTimeout(() => {
            // Create a mock blob for demonstration
            const mockContent = `# ${projectName}\n\nProject ID: ${id}\n\nThis is a mock download. In production, this would be the actual generated project files.`;
            const blob = new Blob([mockContent], { type: 'application/zip' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${projectName.toLowerCase().replace(/\s+/g, '-')}-${id}.zip`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);

            setIsDownloading(false);
        }, 1000);
    };

    const isReady = projectStatus === 'ready';

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-blue-600 rounded"></div>
                        <span className="text-xl font-semibold">AutoPilot</span>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-6 py-8 max-w-4xl">
                {/* Success Banner */}
                <Card className="mb-6 bg-green-50 border-green-200">
                    <div className="flex items-center gap-4">
                        <div className="flex-shrink-0">
                            <svg
                                className="h-12 w-12 text-green-600"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <h1 className="text-2xl font-bold text-green-900 mb-1">
                                Project Ready!
                            </h1>
                            <p className="text-green-700">
                                Your project has been successfully generated and is ready to download.
                            </p>
                        </div>
                    </div>
                </Card>

                {/* Project Summary */}
                <Card className="mb-6">
                    <div className="flex items-start justify-between mb-6">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 mb-2">
                                {projectName}
                            </h2>
                            <p className="text-sm text-gray-600">
                                Project ID: <span className="font-mono">{id}</span>
                            </p>
                        </div>
                        <StatusBadge status={projectStatus} />
                    </div>

                    <div className="border-t border-gray-200 pt-6">
                        <h3 className="text-sm font-semibold text-gray-900 mb-4">
                            Project Details
                        </h3>
                        <div className="space-y-4">
                            {/* Tech Stack */}
                            <div>
                                <p className="text-sm font-medium text-gray-700 mb-2">
                                    Tech Stack
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {techStack.map((tech) => (
                                        <span
                                            key={tech}
                                            className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium"
                                        >
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <p className="text-sm text-gray-600 mb-1">Files Generated</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {filesGenerated}
                                    </p>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <p className="text-sm text-gray-600 mb-1">Approx. Size</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {zipSizeApprox}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Download Section */}
                <Card className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Download Project
                    </h3>
                    <p className="text-sm text-gray-600 mb-6">
                        Download your generated project as a ZIP file. Extract and follow the README
                        instructions to get started.
                    </p>

                    <Button
                        onClick={handleDownload}
                        disabled={!isReady || isDownloading}
                        className="w-full"
                    >
                        <div className="flex items-center justify-center gap-2">
                            {isDownloading ? (
                                <>
                                    <svg
                                        className="animate-spin h-5 w-5"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        ></path>
                                    </svg>
                                    <span>Preparing Download...</span>
                                </>
                            ) : (
                                <>
                                    <svg
                                        className="w-5 h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                                        />
                                    </svg>
                                    <span>Download ZIP</span>
                                </>
                            )}
                        </div>
                    </Button>

                    {!isReady && (
                        <p className="text-sm text-red-600 mt-3 text-center">
                            Project is not ready for download yet
                        </p>
                    )}
                </Card>

                {/* What's Included */}
                <Card className="mb-6 bg-blue-50 border-blue-200">
                    <h3 className="text-sm font-semibold text-blue-900 mb-3">
                        What's included in your download?
                    </h3>
                    <ul className="space-y-2 text-sm text-blue-800">
                        <li className="flex items-start gap-2">
                            <svg
                                className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <span>Complete source code for backend and frontend</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <svg
                                className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <span>Configuration files and environment templates</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <svg
                                className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <span>README with setup instructions</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <svg
                                className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <span>Package dependencies and build scripts</span>
                        </li>
                    </ul>
                </Card>

                {/* Navigation Actions */}
                <Card>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <Button
                            variant="secondary"
                            onClick={() => router.push(`/project/${id}/files`)}
                            className="flex-1"
                        >
                            <div className="flex items-center justify-center gap-2">
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                                    />
                                </svg>
                                View Files
                            </div>
                        </Button>
                        <Button
                            variant="secondary"
                            onClick={() => router.push('/dashboard')}
                            className="flex-1"
                        >
                            <div className="flex items-center justify-center gap-2">
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                                    />
                                </svg>
                                Back to Dashboard
                            </div>
                        </Button>
                    </div>
                </Card>
            </main>
        </div>
    );
}
