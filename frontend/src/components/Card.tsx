import React from 'react';

interface CardProps {
    title?: string;
    description?: string;
    children: React.ReactNode;
    className?: string;
}

export default function Card({ title, description, children, className = '' }: CardProps) {
    return (
        <div className={`bg-white rounded-xl border border-gray-200 shadow-sm p-6 ${className}`}>
            {title && (
                <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                    {description && (
                        <p className="text-sm text-gray-600 mt-1">{description}</p>
                    )}
                </div>
            )}
            {children}
        </div>
    );
}
