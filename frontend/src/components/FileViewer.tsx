import React from 'react';

interface FileViewerProps {
    fileName: string | null;
    filePath: string | null;
    content: string | null;
    className?: string;
}

export default function FileViewer({
    fileName,
    filePath,
    content,
    className = ''
}: FileViewerProps) {
    return (
        <div className={`bg-white border border-gray-200 rounded-lg overflow-hidden flex flex-col ${className}`}>
            {/* Header */}
            <div className="p-3 border-b border-gray-200 bg-gray-50">
                {fileName ? (
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900">{fileName}</h3>
                        <p className="text-xs text-gray-500 mt-0.5 font-mono">{filePath}</p>
                    </div>
                ) : (
                    <h3 className="text-sm font-semibold text-gray-500">No file selected</h3>
                )}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto bg-gray-50">
                {content ? (
                    <div className="p-4">
                        <pre className="text-xs font-mono text-gray-800 leading-relaxed">
                            <code>{content}</code>
                        </pre>
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-64 text-gray-400">
                        <div className="text-center">
                            <svg
                                className="w-16 h-16 mx-auto mb-3 text-gray-300"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <p className="text-sm">Select a file to view its contents</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer with file info */}
            {content && (
                <div className="p-2 border-t border-gray-200 bg-gray-50 text-xs text-gray-500 flex justify-between">
                    <span>Read-only</span>
                    <span>{content.split('\n').length} lines</span>
                </div>
            )}
        </div>
    );
}
