'use client';

import React, { useState } from 'react';
import { 
  PlusIcon, 
  TrashIcon, 
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import { IReference } from '@/domain/model';
import { getTypeIcon, getTypeLabel } from '@/app/projects/[project_id]/utils/referenceUtils';
import AddPanel from './AddPanel';
import DiscoverPanel from './DiscoverPanel';

interface ReferenceManagementProps {
  projectId: string;
  references: IReference[];
  onRemoveReference: (id: string) => void;
}

export default function ReferenceManagement({
  projectId,
  references,
  onRemoveReference,
}: ReferenceManagementProps) {
  const [showAddPanel, setShowAddPanel] = useState(false);
  const [showDiscoverPanel, setShowDiscoverPanel] = useState(false);

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
            No references
          </div>
        ) : (
          <div className="p-1 space-y-2 mt-3">
            {references.map((reference) => (
              <div
                key={reference._id.toString()}
                className={`px-4 py-2 border rounded-lg cursor-pointer transition-colors ${'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}
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
                        <h3 className="max-w-2xs truncate text-sm font-medium text-gray-800 truncate">
                          {reference.title}
                        </h3>
                        
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveReference(reference._id.toString());
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
        projectId={projectId!}
      />
      <DiscoverPanel 
        isOpen={showDiscoverPanel} 
        onClose={() => setShowDiscoverPanel(false)}
      />
    </div>
  );
} 