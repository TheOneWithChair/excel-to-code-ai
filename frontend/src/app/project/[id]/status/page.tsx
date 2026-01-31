'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/Card';
import Button from '@/components/Button';
import StatusBadge, { ProjectStatus } from '@/components/StatusBadge';
import Stepper from '@/components/Stepper';
import LogPanel, { LogMessage } from '@/components/LogPanel';
import { apiClient } from '@/lib/api-client';
import type { Project } from '@/types/api';

interface ProjectStatusPageProps {
    params: Promise<{
        id: string;
    }>;
}

// Map backend status to frontend status
function mapBackendStatus(backendStatus: string): ProjectStatus {
    const statusMap: Record<string, ProjectStatus> = {
        'PENDING': 'uploaded',
        'PARSING': 'parsing',
        'GENERATING': 'generating',
        'DONE': 'ready',
        'FAILED': 'error'
    };
    return statusMap[backendStatus] || 'uploaded';
}

export default function ProjectStatusPage({ params }: ProjectStatusPageProps) {
    const { id } = use(params);
    const router = useRouter();
    const [project, setProject] = useState<Project | null>(null);
    const [currentStatus, setCurrentStatus] = useState<ProjectStatus>('uploaded');
    const [logs, setLogs] = useState<LogMessage[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRetrying, setIsRetrying] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Manual retry generation for stuck projects
    const handleRetryGeneration = async () => {
        if (!project) return;

        try {
            setIsRetrying(true);
            setError(null);
            await apiClient.generateProject(project.id);

            // Refresh project status
            const data = await apiClient.getProject(id);
            setProject(data);
            setCurrentStatus(mapBackendStatus(data.status));

            setLogs(prev => [...prev, {
                id: `${Date.now()}-retry`,
                timestamp: new Date(),
                message: 'Generation restarted manually',
                type: 'success'
            }]);
        } catch (err) {
            console.error('Retry failed:', err);
            setError(err instanceof Error ? err.message : 'Failed to restart generation');
            setLogs(prev => [...prev, {
                id: `${Date.now()}-retry-error`,
                timestamp: new Date(),
                message: `Retry failed: ${err instanceof Error ? err.message : 'Unknown error'}`,
                type: 'error'
            }]);
        } finally {
            setIsRetrying(false);
        }
    };

    // Fetch project data from backend
    useEffect(() => {
        const fetchProject = async () => {
            try {
                setIsLoading(true);
                const data = await apiClient.getProject(id);
                setProject(data);
                setCurrentStatus(mapBackendStatus(data.status));

                // Add initial log with proper structure
                const timestamp = new Date();
                const initialLogs: LogMessage[] = [
                    {
                        id: `${Date.now()}-1`,
                        timestamp,
                        message: `Project "${data.name}" loaded`,
                        type: 'success'
                    },
                    {
                        id: `${Date.now()}-2`,
                        timestamp,
                        message: `Tech Stack: ${data.tech_stack}`,
                        type: 'info'
                    },
                    {
                        id: `${Date.now()}-3`,
                        timestamp,
                        message: `Status: ${data.status}`,
                        type: 'info'
                    }
                ];

                if (data.current_step) {
                    initialLogs.push({
                        id: `${Date.now()}-4`,
                        timestamp,
                        message: data.current_step,
                        type: 'info'
                    });
                }

                setLogs(initialLogs);
            } catch (err) {
                console.error('Error fetching project:', err);
                setError(err instanceof Error ? err.message : 'Failed to load project');
                setLogs([{
                    id: `${Date.now()}-error`,
                    timestamp: new Date(),
                    message: `Error: ${err instanceof Error ? err.message : 'Failed to load project'}`,
                    type: 'error'
                }]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProject();

        // Poll for updates every 5 seconds, but stop if project reaches terminal state
        const interval = setInterval(async () => {
            try {
                const data = await apiClient.getProject(id);
                const status = data.status;

                // Stop polling if project is done or failed
                if (status === 'DONE' || status === 'FAILED') {
                    clearInterval(interval);
                }

                setProject(data);
                setCurrentStatus(mapBackendStatus(status));
            } catch (err) {
                console.error('Polling error:', err);
            }
        }, 5000);

        return () => clearInterval(interval);
    }, [id]);

    // Define the steps for the stepper
    const steps = [
        { id: 'uploaded', label: 'Uploaded', status: 'uploaded' as ProjectStatus },
        { id: 'parsing', label: 'Parsing Excel Files', status: 'parsing' as ProjectStatus },
        { id: 'generating', label: 'Generating Project', status: 'generating' as ProjectStatus },
        { id: 'optimizing', label: 'Optimizing Code', status: 'optimizing' as ProjectStatus },
        { id: 'ready', label: 'Ready', status: 'ready' as ProjectStatus }
    ];

    const isReady = currentStatus === 'ready';
    const hasError = currentStatus === 'error';

    if (isLoading && !project) {
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
                        <p className="mt-4 text-gray-600">Loading project...</p>
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
                                {project?.name || 'Project'}
                            </h1>
                            <p className="text-sm text-gray-600">
                                Project ID: <span className="font-mono">{id}</span>
                            </p>
                            {project?.tech_stack && (
                                <p className="text-sm text-gray-600 mt-1">
                                    Tech Stack: {project.tech_stack}
                                </p>
                            )}
                        </div>
                        <StatusBadge status={currentStatus} />
                    </div>
                </Card>

                {/* Progress Stepper */}
                <Card className="mb-6">
                    <Stepper steps={steps} currentStep={currentStatus} />
                </Card>

                {/* Error Message */}
                {hasError && (
                    <Card className="mb-6 bg-red-50 border-red-200">
                        <div className="flex items-center gap-4">
                            <div className="shrink-0">
                                <svg className="h-8 w-8 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-red-900">
                                    Project Generation Failed
                                </h3>
                                <p className="text-sm text-red-800">
                                    {project?.current_step || 'An error occurred during project generation.'}
                                </p>
                            </div>
                        </div>
                    </Card>
                )}

                {/* Progress Indicator */}
                {!isReady && !hasError && (
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
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    {currentStatus === 'parsing' && 'Parsing Excel Files'}
                                    {currentStatus === 'generating' && 'Generating Project'}
                                    {currentStatus === 'uploaded' && 'Processing Upload'}
                                </h3>
                                <p className="text-sm text-gray-600">
                                    {project?.current_step || 'Please wait while we process your project...'}
                                </p>
                            </div>
                            {currentStatus === 'uploaded' && project?.status === 'PENDING' && (
                                <Button
                                    onClick={handleRetryGeneration}
                                    disabled={isRetrying}
                                    variant="secondary"
                                >
                                    {isRetrying ? 'Starting...' : 'Start Generation'}
                                </Button>
                            )}
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
