'use client';

import React, { useState } from 'react';

export interface FileNode {
    id: string; // This can be the path from API
    name: string;
    type: 'file' | 'folder' | 'directory';
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
    className = '',
}: ProjectTreeProps) {
    const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
        new Set(tree.filter(n => n.type === 'folder' || n.type === 'directory').map(n => n.id))
    );

    const toggleFolder = (id: string) => {
        setExpandedFolders(prev => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    const renderNode = (node: FileNode, depth = 0) => {
        const isExpanded = expandedFolders.has(node.id);
        const isSelected = selectedFile === node.id;
        const isChecked = selectedForOptimization.has(node.id);

        return (
            <div key={node.id}>
                {/* Grid layout: checkbox column + content column */}
                <div
                    className={`grid grid-cols-[24px_1fr] items-center h-7 pr-2 hover:bg-gray-50 cursor-pointer ${isSelected ? 'bg-blue-50' : ''
                        }`}
                >
                    {/* Column 1: Checkbox (fixed position, no indentation) */}
                    <div className="flex items-center justify-center">
                        <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => {
                                e.stopPropagation();
                                onToggleOptimization(node.id);
                            }}
                            className="w-4 h-4 cursor-pointer flex-shrink-0"
                        />
                    </div>

                    {/* Column 2: Content area with indentation */}
                    <div className="flex items-center min-w-0">
                        {/* Indentation spacer - only affects content, not checkbox */}
                        <div style={{ width: `${depth * 16}px` }} className="flex-shrink-0" />

                        {/* Expand/Collapse Arrow */}
                        {(node.type === 'folder' || node.type === 'directory') ? (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    toggleFolder(node.id);
                                }}
                                className="w-4 h-4 mr-1.5 flex items-center justify-center flex-shrink-0"
                            >
                                <svg
                                    className={`w-3 h-3 text-gray-500 transition-transform ${isExpanded ? 'rotate-90' : ''
                                        }`}
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </button>
                        ) : (
                            <div className="w-4 h-4 mr-1.5 flex-shrink-0" />
                        )}

                        {/* Folder/File Icon */}
                        {(node.type === 'folder' || node.type === 'directory') ? (
                            <svg
                                className="w-4 h-4 text-blue-500 mr-1.5 flex-shrink-0"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                            </svg>
                        ) : (
                            <svg
                                className="w-4 h-4 text-gray-400 mr-1.5 flex-shrink-0"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        )}

                        {/* File/Folder Name */}
                        <button
                            onClick={() =>
                                node.type === 'file' ? onFileSelect(node) : toggleFolder(node.id)
                            }
                            className="flex-1 text-left min-w-0"
                        >
                            <span
                                className={`text-sm truncate block ${isSelected ? 'font-medium text-blue-700' : 'text-gray-700'
                                    }`}
                            >
                                {node.name}
                            </span>
                        </button>
                    </div>
                </div>

                {/* Children */}
                {(node.type === 'folder' || node.type === 'directory') &&
                    isExpanded &&
                    node.children?.map((child) => renderNode(child, depth + 1))}
            </div>
        );
    };

    return (
        <div className={`bg-white border border-gray-200 rounded-lg ${className}`}>
            <div className="px-3 py-2 border-b bg-gray-50">
                <h3 className="text-sm font-semibold text-gray-900">Project Files</h3>
            </div>
            <div className="max-h-[600px] overflow-y-auto">
                {tree.map(node => renderNode(node))}
            </div>
        </div>
    );
}
