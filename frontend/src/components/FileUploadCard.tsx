'use client';

import React, { useState, useRef } from 'react';

interface FileUploadCardProps {
    label: string;
    fileName: string;
    description?: string;
    onFileSelect: (file: File) => void;
}

export default function FileUploadCard({
    label,
    fileName,
    description,
    onFileSelect
}: FileUploadCardProps) {
    const [uploadStatus, setUploadStatus] = useState<'not-uploaded' | 'uploaded'>('not-uploaded');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && file.name.endsWith('.xlsx')) {
            setSelectedFile(file);
            setUploadStatus('uploaded');
            onFileSelect(file);
        } else {
            alert('Please select a valid .xlsx file');
        }
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
            <div className="flex items-center justify-between mb-2">
                <div>
                    <h4 className="text-sm font-medium text-gray-900">{label}</h4>
                    {description && (
                        <p className="text-xs text-gray-500 mt-1">{description}</p>
                    )}
                </div>
                <div className="flex items-center space-x-2">
                    {uploadStatus === 'uploaded' ? (
                        <span className="flex items-center text-xs text-green-600">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Uploaded
                        </span>
                    ) : (
                        <span className="text-xs text-gray-400">Not uploaded</span>
                    )}
                </div>
            </div>

            <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx"
                onChange={handleFileChange}
                className="hidden"
            />

            <button
                onClick={handleClick}
                className="w-full mt-2 px-4 py-2 border border-dashed border-gray-300 rounded-lg text-sm text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors"
            >
                {selectedFile ? (
                    <span className="flex items-center justify-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        {selectedFile.name}
                    </span>
                ) : (
                    <span className="flex items-center justify-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        Click to upload {fileName}
                    </span>
                )}
            </button>
        </div>
    );
}
