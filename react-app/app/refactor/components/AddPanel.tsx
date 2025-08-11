'use client';

import React from 'react';
import { PlusIcon, MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Reference } from '../editor';

interface AddPanelProps {
  isOpen: boolean;
  onClose: () => void;
  references: Reference[];
}

export default function AddPanel({ isOpen, onClose, references }: AddPanelProps) {
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
              <h3 className="text-lg font-medium text-gray-800">Upload Reference</h3>
              <div className="grid grid-cols-1 md:grid-cols-1 gap-3">
                <button className="flex flex-col items-center justify-center space-y-3 p-8 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors min-h-[120px]">
                  <PlusIcon className="w-8 h-8 text-gray-400" />
                  <div className="text-center">
                    <span className="text-gray-600 font-medium">Upload File</span>
                    <p className="text-sm text-gray-500 mt-1">Drag & drop files here or click to browse</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Connect Tools Section */}
            <div className="space-y-3">
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

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Add Reference
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 