import React from 'react';

export type ProjectStatus = 'uploaded' | 'parsing' | 'generating' | 'optimizing' | 'ready' | 'error';

interface StatusBadgeProps {
    status: ProjectStatus;
    className?: string;
}

export default function StatusBadge({ status, className = '' }: StatusBadgeProps) {
    const statusConfig = {
        uploaded: {
            label: 'Uploaded',
            bgColor: 'bg-gray-100',
            textColor: 'text-gray-700',
            dotColor: 'bg-gray-500'
        },
        parsing: {
            label: 'Parsing',
            bgColor: 'bg-blue-100',
            textColor: 'text-blue-700',
            dotColor: 'bg-blue-500'
        },
        generating: {
            label: 'Generating',
            bgColor: 'bg-purple-100',
            textColor: 'text-purple-700',
            dotColor: 'bg-purple-500'
        },
        optimizing: {
            label: 'Optimizing',
            bgColor: 'bg-yellow-100',
            textColor: 'text-yellow-700',
            dotColor: 'bg-yellow-500'
        },
        ready: {
            label: 'Ready',
            bgColor: 'bg-green-100',
            textColor: 'text-green-700',
            dotColor: 'bg-green-500'
        },
        error: {
            label: 'Error',
            bgColor: 'bg-red-100',
            textColor: 'text-red-700',
            dotColor: 'bg-red-500'
        }
    };

    const config = statusConfig[status];

    return (
        <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${config.bgColor} ${config.textColor} ${className}`}>
            <span className={`w-2 h-2 rounded-full ${config.dotColor}`}></span>
            {config.label}
        </span>
    );
}
