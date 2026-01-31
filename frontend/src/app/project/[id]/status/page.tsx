'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/Card';
import Button from '@/components/Button';
import StatusBadge, { ProjectStatus } from '@/components/StatusBadge';
import Stepper from '@/components/Stepper';
import LogPanel, { LogMessage } from '@/components/LogPanel';

interface ProjectStatusPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default function ProjectStatusPage({ params }: ProjectStatusPageProps) {
    const { id } = use(params);
    const router = useRouter();
    const [projectName] = useState('E-Commerce Platform');
    const [currentStatus, setCurrentStatus] = useState<ProjectStatus>('uploaded');
    const [logs, setLogs] = useState<LogMessage[]>([]);

    // Define the steps for the stepper
    const steps = [
        { id: 'uploaded', label: 'Uploaded', status: 'uploaded' as ProjectStatus },
        { id: 'parsing', label: 'Parsing Excel Files', status: 'parsing' as ProjectStatus },
        { id: 'generating', label: 'Generating Project', status: 'generating' as ProjectStatus },
        { id: 'optimizing', label: 'Optimizing Code', status: 'optimizing' as ProjectStatus },
        { id: 'ready', label: 'Ready', status: 'ready' as ProjectStatus }
    ];

    // Mock progress simulation
    useEffect(() => {
        const progressSequence = [
            {
                status: 'uploaded' as ProjectStatus,
                logs: [
                    { message: 'Project files received successfully', type: 'success' as const },
                    { message: 'Validating Excel file structure...', type: 'info' as const }
                ],
                delay: 2000
            },
            {
                status: 'parsing' as ProjectStatus,
                logs: [
                    { message: 'Starting Excel file parsing', type: 'info' as const },
                    { message: 'Parsing features.xlsx...', type: 'info' as const },
                    { message: 'Extracted 15 feature definitions', type: 'success' as const },
                    { message: 'Parsing data-models.xlsx...', type: 'info' as const },
                    { message: 'Found 8 data models', type: 'success' as const },
                    { message: 'Parsing api-routes.xlsx...', type: 'info' as const },
                    { message: 'Identified 24 API endpoints', type: 'success' as const }
                ],
                delay: 4000
            },
            {
                status: 'generating' as ProjectStatus,
                logs: [
                    { message: 'Initializing project structure', type: 'info' as const },
                    { message: 'Generating backend services...', type: 'info' as const },
                    { message: 'Creating database models', type: 'info' as const },
                    { message: 'Generating API routes', type: 'info' as const },
                    { message: 'Building frontend components', type: 'info' as const },
                    { message: 'Setting up authentication layer', type: 'info' as const },
                    { message: 'Configuring middleware', type: 'info' as const },
                    { message: 'Generated 127 files', type: 'success' as const }
                ],
                delay: 5000
            },
            {
                status: 'optimizing' as ProjectStatus,
                logs: [
                    { message: 'Running code optimization', type: 'info' as const },
                    { message: 'Formatting code files', type: 'info' as const },
                    { message: 'Removing unused imports', type: 'info' as const },
                    { message: 'Optimizing bundle size', type: 'info' as const },
                    { message: 'Running linter checks', type: 'info' as const },
                    { message: 'Verifying type definitions', type: 'info' as const },
                    { message: 'Optimization complete', type: 'success' as const }
                ],
                delay: 3000
            },
            {
                status: 'ready' as ProjectStatus,
                logs: [
                    { message: 'Project generation completed successfully!', type: 'success' as const },
                    { message: 'All files are ready for download', type: 'success' as const }
                ],
                delay: 0
            }
        ];

        let currentStep = 0;
        let logIndex = 0;

        const advanceProgress = () => {
            if (currentStep >= progressSequence.length) return;

            const step = progressSequence[currentStep];
            setCurrentStatus(step.status);

            // Add logs one by one
            const addNextLog = () => {
                if (logIndex < step.logs.length) {
                    const logEntry = step.logs[logIndex];
                    setLogs(prev => [
                        ...prev,
                        {
                            id: `${Date.now()}-${logIndex}`,
                            timestamp: new Date(),
                            message: logEntry.message,
                            type: logEntry.type
                        }
                    ]);
                    logIndex++;
                    setTimeout(addNextLog, 500);
                } else {
                    // Move to next step
                    logIndex = 0;
                    currentStep++;
                    if (currentStep < progressSequence.length) {
                        setTimeout(advanceProgress, step.delay);
                    }
                }
            };

            addNextLog();
        };

        // Start the simulation
        setTimeout(advanceProgress, 1000);
    }, []);

    const isReady = currentStatus === 'ready';

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
            <main className="container mx-auto px-6 py-8 max-w-5xl">
                {/* Project Header */}
                <Card className="mb-6">
                    <div className="flex items-start justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">
                                {projectName}
                            </h1>
                            <p className="text-sm text-gray-600">
                                Project ID: <span className="font-mono">{id}</span>
                            </p>
                        </div>
                        <StatusBadge status={currentStatus} />
                    </div>
                </Card>

                {/* Progress Stepper */}
                <Card className="mb-6">
                    <Stepper steps={steps} currentStep={currentStatus} />
                </Card>

                {/* Progress Indicator */}
                {!isReady && (
                    <Card className="mb-6">
                        <div className="flex items-center gap-4">
                            <div className="shrink-0">
                                <svg
                                    className="animate-spin h-8 w-8 text-blue-600"
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
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Processing Your Project
                                </h3>
                                <p className="text-sm text-gray-600">
                                    This may take a few minutes. Please do not close this window.
                                </p>
                            </div>
                        </div>
                    </Card>
                )}

                {/* Success Message */}
                {isReady && (
                    <Card className="mb-6 bg-green-50 border-green-200">
                        <div className="flex items-center gap-4">
                            <div className="shrink-0">
                                <svg
                                    className="h-8 w-8 text-green-600"
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
                            <div>
                                <h3 className="text-lg font-semibold text-green-900">
                                    Project Ready!
                                </h3>
                                <p className="text-sm text-green-700">
                                    Your project has been generated successfully and is ready to download.
                                </p>
                            </div>
                        </div>
                    </Card>
                )}

                {/* Logs Panel */}
                <LogPanel logs={logs} className="mb-6" />

                {/* Action Buttons */}
                <Card>
                    <div className="flex gap-4">
                        <Button
                            variant="secondary"
                            onClick={() => router.push(`/project/${id}/files`)}
                            disabled={!isReady}
                        >
                            View Files
                        </Button>
                        <Button
                            onClick={() => router.push(`/project/${id}/download`)}
                            disabled={!isReady}
                        >
                            Download Project
                        </Button>
                    </div>
                    {!isReady && (
                        <p className="text-sm text-gray-500 mt-4">
                            Actions will be available once the project is ready
                        </p>
                    )}
                </Card>
            </main>
        </div>
    );
}
