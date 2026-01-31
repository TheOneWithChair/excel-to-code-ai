import React from 'react';
import Button from './Button';

interface OptimizationPanelProps {
    selectedCount: number;
    selectedItems: string[];
    onOptimize: () => void;
    onRegenerate: () => void;
    className?: string;
}

export default function OptimizationPanel({
    selectedCount,
    selectedItems,
    onOptimize,
    onRegenerate,
    className = ''
}: OptimizationPanelProps) {
    const hasSelection = selectedCount > 0;

    return (
        <div className={`bg-white border border-gray-200 rounded-lg overflow-hidden ${className}`}>
            <div className="p-4 border-b border-gray-200 bg-gray-50">
                <h3 className="text-sm font-semibold text-gray-900">Optimization Panel</h3>
                <p className="text-xs text-gray-600 mt-1">
                    {hasSelection
                        ? `${selectedCount} item${selectedCount !== 1 ? 's' : ''} selected`
                        : 'Select files or folders to optimize'}
                </p>
            </div>

            <div className="p-4 space-y-4">
                {/* Selected Items Preview */}
                {hasSelection && selectedItems.length > 0 && (
                    <div className="bg-gray-50 rounded-lg p-3 max-h-32 overflow-y-auto">
                        <p className="text-xs font-medium text-gray-700 mb-2">
                            Selected for optimization:
                        </p>
                        <ul className="text-xs text-gray-600 space-y-1">
                            {selectedItems.slice(0, 5).map((item, index) => (
                                <li key={index} className="flex items-center gap-2">
                                    <svg
                                        className="w-3 h-3 text-gray-400"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    <span className="font-mono">{item}</span>
                                </li>
                            ))}
                            {selectedItems.length > 5 && (
                                <li className="text-gray-500 italic">
                                    +{selectedItems.length - 5} more...
                                </li>
                            )}
                        </ul>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-3">
                    <Button
                        onClick={onOptimize}
                        disabled={!hasSelection}
                        className="w-full"
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
                                    d="M13 10V3L4 14h7v7l9-11h-7z"
                                />
                            </svg>
                            Optimize Selected Files
                        </div>
                    </Button>

                    <Button
                        onClick={onRegenerate}
                        disabled={!hasSelection}
                        variant="secondary"
                        className="w-full"
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
                                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                />
                            </svg>
                            Regenerate Selected Modules
                        </div>
                    </Button>
                </div>

                {/* Info text */}
                {!hasSelection && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <div className="flex gap-2">
                            <svg
                                className="w-4 h-4 text-blue-600 shrink-0 mt-0.5"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <div>
                                <p className="text-xs font-medium text-blue-900">
                                    How to use optimization
                                </p>
                                <p className="text-xs text-blue-700 mt-1">
                                    Select files or folders from the tree view using checkboxes, then
                                    choose an optimization action.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
