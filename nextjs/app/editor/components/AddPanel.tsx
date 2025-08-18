'use client';

import React, { useState, useCallback, useRef } from 'react';
import { PlusIcon, MagnifyingGlassIcon, XMarkIcon, DocumentIcon } from '@heroicons/react/24/outline';
import { Reference } from '../editor';

interface AddPanelProps {
  isOpen: boolean;
  onClose: () => void;
  references: Reference[];
  projectId: string;
  onReferenceAdded: () => void;
}

export default function AddPanel({ isOpen, onClose, references, projectId, onReferenceAdded }: AddPanelProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback((file: File) => {
    // Validate file type
    if (file.type !== 'application/pdf') {
      alert('Please select a PDF file');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB');
      return;
    }

    setUploadedFile(file);
    // Title will be auto-generated from filename
  }, []);

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    const pdfFile = files.find(file => file.type === 'application/pdf');
    
    if (pdfFile) {
      handleFileSelect(pdfFile);
    } else {
      alert('Please drop a PDF file');
    }
  }, []);

  const handleUpload = async () => {
    if (!uploadedFile) {
      alert('Please select a file');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('title', uploadedFile.name);
      formData.append('type', 'pdf');
      formData.append('file', uploadedFile);

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 100);

      const response = await fetch(`/api/project/${projectId}/reference`, {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (response.ok) {
        const result = await response.json();
        console.log("RESULT: ", result);
        // Reset form
        setUploadedFile(null);
        setUploadProgress(0);
        
        // Notify parent component
        onReferenceAdded();
        
        // Close panel after successful upload
        setTimeout(() => onClose(), 1000);
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert(`Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-3/4 h-3/4 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Add Reference</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="space-y-6">
            {/* Upload Reference Section */}
            <div className="space-y-3">
              <h3 className="text-lg font-medium text-gray-800">Upload PDF Reference</h3>
              
              {/* File Upload Area */}
              <div className="grid grid-cols-1 md:grid-cols-1 gap-3">
                {!uploadedFile ? (
                  <div
                    className={`flex flex-col items-center justify-center space-y-3 p-8 border-2 border-dashed rounded-lg transition-colors min-h-[120px] cursor-pointer ${
                      isDragging
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={openFileDialog}
                  >
                    <PlusIcon className="w-8 h-8 text-gray-400" />
                    <div className="text-center">
                      <span className="text-gray-600 font-medium">Upload PDF File</span>
                      <p className="text-sm text-gray-500 mt-1">
                        Drag & drop PDF here or click to browse
                      </p>
                      <p className="text-xs text-gray-400 mt-2">Max size: 10MB</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center space-y-3 p-8 border-2 border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3 w-full h-30">
                      <DocumentIcon className="w-10 h-10 text-red-500" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between space-x-3">
                          <p className="font-medium text-gray-900">{uploadedFile.name}</p>
                          <button
                            onClick={handleRemoveFile}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <XMarkIcon className="w-5 h-5" />
                          </button>
                        </div>
                        <p className="text-sm text-gray-500">
                          {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      
                    </div>
                  </div>
                )}
                
                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={handleFileInputChange}
                  className="hidden"
                />
              </div>


            </div>

            {/* Connect Tools Section */}
            <div className="space-y-3">
              <h3 className="text-lg font-medium text-gray-800">Other Options</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <button className="flex items-center justify-center space-x-3 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <MagnifyingGlassIcon className="w-6 h-6 text-gray-400" />
                  <span className="text-gray-600">Add URL</span>
                </button>
                <button className="flex items-center justify-center space-x-3 p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <span className="text-2xl">🔧</span>
                  <span className="text-gray-700">Connect MATLAB</span>
                </button>
                <button className="flex items-center justify-center space-x-3 p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <span className="text-2xl">⚡</span>
                  <span className="text-gray-700">Connect Simulation Tool</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200">
          {/* Reference Limit Section */}
          <div className="mb-4">
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Current References</span>
                <span className="font-semibold text-gray-800">{references.length}/100</span>
              </div>
              <div className="bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min((references.length / 100) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Upload Progress */}
          {isUploading && (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Uploading...</span>
                <span className="text-sm font-medium text-gray-800">{uploadProgress}%</span>
              </div>
              <div className="bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3">
            <button
              onClick={handleUpload}
              disabled={!uploadedFile || isUploading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? 'Uploading...' : 'Upload PDF'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 