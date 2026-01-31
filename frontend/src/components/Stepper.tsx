import React from 'react';
import { ProjectStatus } from './StatusBadge';

interface Step {
    id: string;
    label: string;
    status: ProjectStatus;
}

interface StepperProps {
    steps: Step[];
    currentStep: string;
    className?: string;
}

export default function Stepper({ steps, currentStep, className = '' }: StepperProps) {
    const currentIndex = steps.findIndex(step => step.id === currentStep);

    return (
        <div className={`w-full ${className}`}>
            <div className="flex items-center justify-between">
                {steps.map((step, index) => {
                    const isCompleted = index < currentIndex;
                    const isCurrent = step.id === currentStep;
                    const isPending = index > currentIndex;

                    return (
                        <React.Fragment key={step.id}>
                            {/* Step */}
                            <div className="flex flex-col items-center flex-1">
                                {/* Circle */}
                                <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${isCompleted
                                            ? 'bg-green-500 text-white'
                                            : isCurrent
                                                ? 'bg-blue-600 text-white ring-4 ring-blue-100'
                                                : 'bg-gray-200 text-gray-500'
                                        }`}
                                >
                                    {isCompleted ? (
                                        <svg
                                            className="w-5 h-5"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    ) : (
                                        index + 1
                                    )}
                                </div>

                                {/* Label */}
                                <span
                                    className={`mt-2 text-xs font-medium text-center ${isCurrent
                                            ? 'text-gray-900'
                                            : isCompleted
                                                ? 'text-gray-700'
                                                : 'text-gray-500'
                                        }`}
                                >
                                    {step.label}
                                </span>
                            </div>

                            {/* Connector Line */}
                            {index < steps.length - 1 && (
                                <div
                                    className={`flex-1 h-0.5 -mt-8 transition-colors ${index < currentIndex
                                            ? 'bg-green-500'
                                            : 'bg-gray-200'
                                        }`}
                                />
                            )}
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );
}
