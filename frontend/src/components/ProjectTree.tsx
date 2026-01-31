'use client';

import React, { useState } from 'react';

export interface FileNode {
    id: string;
    name: string;
    type: 'file' | 'folder';
    path: string;
    children?: FileNode[];
    content?: string;
}

interface ProjectTreeProps {
    tree: FileNode[];
    selectedFile: string | null;
    selectedForOptimization: Set<string>;
    onFileSelect: (file: FileNode) => void;
    onToggleOptimization: (id: string) => void;
    className?: string;
}

export default function ProjectTree({
    tree,
    selectedFile,
    selectedForOptimization,
    onFileSelect,
    onToggleOptimization,
    className = ''
}: ProjectTreeProps) {
    const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
        new Set(tree.filter(n => n.type === 'folder').map(n => n.id))
    );

    const toggleFolder = (id: string) => {
        setExpandedFolders(prev => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    };

    const renderNode = (node: FileNode, depth: number = 0) => {
        const isExpanded = expandedFolders.has(node.id);
        const isSelected = selectedFile === node.id;
        const isChecked = selectedForOptimization.has(node.id);

        return (
            <div key={node.id}>
                <div
                    className={`flex items-center gap-2 px-3 py-1.5 hover:bg-gray-100 cursor-pointer ${isSelected ? 'bg-blue-50 border-l-2 border-blue-600' : ''
                        }`}
                    style={{ paddingLeft: `${depth * 16 + 12}px` }}
                >
                    {/* Checkbox */}
                    <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => {
                            e.stopPropagation();
                            onToggleOptimization(node.id);
                        }}
                        className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />

                    {/* Folder Icon / Expand Toggle */}
                    {node.type === 'folder' ? (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                toggleFolder(node.id);
                            }}
                            className="flex items-center gap-1 flex-1"
                        >
                            <svg
                                className={`w-4 h-4 text-gray-500 transition-transform ${isExpanded ? 'rotate-90' : ''
                                    }`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <svg
                                className="w-4 h-4 text-blue-500"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                            </svg>
                            <span className="text-sm font-medium text-gray-700">
                                {node.name}
                            </span>
                        </button>
                    ) : (
                        <button
                            onClick={() => onFileSelect(node)}
                            className="flex items-center gap-1 flex-1"
                        >
                            <svg
                                className="w-4 h-4 text-gray-400 ml-5"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <span
                                className={`text-sm ${isSelected
                                    ? 'font-medium text-blue-700'
                                    : 'text-gray-600'
                                    }`}
                            >
                                {node.name}
                            </span>
                        </button>
                    )}
                </div>

                {/* Render children if folder is expanded */}
                {node.type === 'folder' &&
                    isExpanded &&
                    node.children?.map(child => renderNode(child, depth + 1))}
            </div>
        );
    };

    return (
        <div className={`bg-white border border-gray-200 rounded-lg overflow-hidden ${className}`}>
            <div className="p-3 border-b border-gray-200 bg-gray-50">
                <h3 className="text-sm font-semibold text-gray-900">Project Files</h3>
            </div>
            <div className="overflow-y-auto max-h-150">
                {tree.map(node => renderNode(node))}
            </div>
        </div>
    );
}
