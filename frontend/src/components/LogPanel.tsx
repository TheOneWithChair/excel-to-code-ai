import React from 'react';

export interface LogMessage {
    id: string;
    timestamp: Date;
    message: string;
    type?: 'info' | 'success' | 'warning' | 'error';
}

interface LogPanelProps {
    logs: LogMessage[];
    className?: string;
}

export default function LogPanel({ logs, className = '' }: LogPanelProps) {
    const getIconColor = (type: LogMessage['type']) => {
        switch (type) {
            case 'success':
                return 'text-green-500';
            case 'warning':
                return 'text-yellow-500';
            case 'error':
                return 'text-red-500';
            default:
                return 'text-blue-500';
        }
    };

    const getIcon = (type: LogMessage['type']) => {
        switch (type) {
            case 'success':
                return (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                        />
                    </svg>
                );
            case 'error':
                return (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                            clipRule="evenodd"
                        />
                    </svg>
                );
            case 'warning':
                return (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path
                            fillRule="evenodd"
                            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                        />
                    </svg>
                );
            default:
                return (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                            clipRule="evenodd"
                        />
                    </svg>
                );
        }
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });
    };

    return (
        <div className={`bg-gray-50 rounded-lg border border-gray-200 ${className}`}>
            <div className="p-4 border-b border-gray-200">
                <h3 className="text-sm font-semibold text-gray-900">Status Messages</h3>
            </div>
            <div className="h-64 overflow-y-auto p-4 space-y-2 font-mono text-xs">
                {logs.length === 0 ? (
                    <div className="text-gray-500 text-center py-8">
                        No logs available yet
                    </div>
                ) : (
                    logs.map((log) => (
                        <div key={log.id} className="flex items-start gap-3 text-gray-700">
                            <span className="text-gray-400 shrink-0">
                                {formatTime(log.timestamp)}
                            </span>
                            <span className={`shrink-0 ${getIconColor(log.type)}`}>
                                {getIcon(log.type)}
                            </span>
                            <span className="flex-1">{log.message}</span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
