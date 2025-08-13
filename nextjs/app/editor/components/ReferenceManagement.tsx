'use client';

import React, { useState, useEffect } from 'react';
import { 
  PlusIcon, 
  TrashIcon, 
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import { Reference } from '../editor';
import { getTypeIcon, getTypeLabel } from '../utils/referenceUtils';
import AddPanel from './AddPanel';
import DiscoverPanel from './DiscoverPanel';
import { useSearchParams } from 'next/navigation';

interface ReferenceManagementProps {
  references: Reference[];
  selectedReferences: string[];
  onRemoveReference: (id: string) => void;
  onToggleSelection: (id: string) => void;
}

export default function ReferenceManagement({
  references,
  selectedReferences,
  onRemoveReference,
  onToggleSelection
}: ReferenceManagementProps) {
  const [showAddPanel, setShowAddPanel] = useState(false);
  const [showDiscoverPanel, setShowDiscoverPanel] = useState(false);
  const [projectId, setProjectId] = useState<string>('');
  const searchParams = useSearchParams();

  useEffect(() => {
    // Get project ID from URL query parameter
    const projectIdFromUrl = searchParams.get('project');
    if (projectIdFromUrl) {
      setProjectId(projectIdFromUrl);
    }
  }, [searchParams]);

  const handleReferenceAdded = () => {
    // Refresh references or notify parent component
    // For now, we'll just close the panel
    setShowAddPanel(false);
  };

  return (
    <div className="h-full bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex space-x-2 mb-3">
          <h2 className="flex flex-1 justify-end text-lg font-semibold text-gray-800">References</h2>
        </div>
        
        {/* Add and Discover Buttons */}
        <div className="flex space-x-2">
          <button
            onClick={() => setShowAddPanel(!showAddPanel)}
            className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            <PlusIcon className="w-4 h-4" />
            <span>Add</span>
          </button>
          <button
            onClick={() => setShowDiscoverPanel(!showDiscoverPanel)}
            className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            <MagnifyingGlassIcon className="w-4 h-4" />
            <span>Discover</span>
          </button>
        </div>
      </div>

      {/* References List */}
      <div className="flex-1 overflow-y-auto">
        {references.length === 0 ? (
          <div className="p-4 text-center text-gray-500 mt-3">
            No references added yet
          </div>
        ) : (
          <div className="p-1 space-y-2 mt-3">
            {references.map((reference) => (
              <div
                key={reference.id}
                className={`px-4 py-2 border rounded-lg cursor-pointer transition-colors ${
                  selectedReferences.includes(reference.id)
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
                onClick={() => onToggleSelection(reference.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 flex-1">
                    <div 
                      className="relative group"
                      title={getTypeLabel(reference.type)}
                    >
                      {getTypeIcon(reference.type)}
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1 mb-1 px-1 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                        {getTypeLabel(reference.type)}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-sm font-medium text-gray-800 truncate">
                          {reference.title}
                        </h3>
                        
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveReference(reference.id);
                    }}
                    className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                    title="Remove reference"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Popup Panels */}
      <AddPanel 
        isOpen={showAddPanel} 
        onClose={() => setShowAddPanel(false)} 
        references={references}
        projectId={projectId}
        onReferenceAdded={handleReferenceAdded}
      />
      <DiscoverPanel 
        isOpen={showDiscoverPanel} 
        onClose={() => setShowDiscoverPanel(false)}
      />
    </div>
  );
} 