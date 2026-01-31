'use client';

import React from 'react';

interface TechStackOption {
    value: string;
    label: string;
}

interface TechStackSelectorProps {
    category: string;
    options: TechStackOption[];
    selected: string;
    onSelect: (value: string) => void;
}

export default function TechStackSelector({
    category,
    options,
    selected,
    onSelect
}: TechStackSelectorProps) {
    return (
        <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-900">
                {category}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {options.map((option) => (
                    <button
                        key={option.value}
                        onClick={() => onSelect(option.value)}
                        className={`px-4 py-3 rounded-lg border-2 text-sm font-medium transition-all ${selected === option.value
                                ? 'border-blue-600 bg-blue-50 text-blue-700'
                                : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                            }`}
                    >
                        {option.label}
                    </button>
                ))}
            </div>
        </div>
    );
}
