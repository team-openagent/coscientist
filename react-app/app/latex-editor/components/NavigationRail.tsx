'use client';

import React, { useState } from 'react';
import { 
  FolderIcon,
  BookOpenIcon,
  ChatBubbleLeftRightIcon,
  CogIcon,
  DocumentTextIcon,
  ChartBarIcon,
  PlusIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

interface NavigationRailProps {
  selectedSection: string;
  onSectionChange: (section: string) => void;
}

const mainSections = [
  { id: 'explorer', name: 'Explorer', icon: FolderIcon },
  { id: 'references', name: 'Reference Management', icon: BookOpenIcon },
  { id: 'discussion', name: 'Discussion', icon: ChatBubbleLeftRightIcon },
];

const documentSections = [
  { id: 'abstraction', name: 'Abstraction', icon: DocumentTextIcon },
  { id: 'introduction', name: 'Introduction', icon: DocumentTextIcon },
  { id: 'experiment', name: 'Experiment', icon: ChartBarIcon },
  { id: 'discussion', name: 'Discussion', icon: DocumentTextIcon },
  { id: 'reference', name: 'Reference', icon: BookOpenIcon },
];

const sampleFiles = [
  { id: '1', name: 'main.tex', type: 'tex' },
  { id: '2', name: 'references.bib', type: 'bib' },
  { id: '3', name: 'figures/', type: 'folder' },
  { id: '4', name: 'tables/', type: 'folder' },
];

export default function NavigationRail({ selectedSection, onSectionChange }: NavigationRailProps) {
  const [activePanel, setActivePanel] = useState<string | null>(null);

  const handleSectionClick = (sectionId: string) => {
    if (activePanel === sectionId) {
      setActivePanel(null);
    } else {
      setActivePanel(sectionId);
    }
    onSectionChange(sectionId);
  };

  return (
    <div className="h-full bg-white border-r border-gray-200 flex">
      {/* Icon Rail */}
      <div className="w-16 bg-gray-50 border-r border-gray-200 flex flex-col items-center py-4 space-y-4">
        {mainSections.map((section) => {
          const Icon = section.icon;
          return (
            <button
              key={section.id}
              onClick={() => handleSectionClick(section.id)}
              className={`w-10 h-10 flex items-center justify-center rounded-lg transition-all duration-200 hover:shadow-sm cursor-pointer ${
                activePanel === section.id
                  ? 'bg-blue-100 text-blue-600 border border-blue-200'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
              }`}
              title={section.name}
            >
              <Icon className="w-5 h-5" />
            </button>
          );
        })}
        
        <div className="flex-1"></div>
        
        <button className="w-10 h-10 flex items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-800 transition-all duration-200 hover:shadow-sm cursor-pointer">
          <CogIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Panel Content */}
      {activePanel === 'explorer' && (
        <div className="w-64 flex flex-col">
          {/* File List */}
          <div className="flex-1 border-b border-gray-200">
            <div className="p-3 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-700">Files</h3>
              <button className="text-gray-400 hover:text-gray-600">
                <PlusIcon className="w-4 h-4" />
              </button>
            </div>
            <div className="p-2 space-y-1">
              {sampleFiles.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center space-x-2 px-2 py-1 text-sm text-gray-600 hover:bg-gray-50 rounded cursor-pointer"
                >
                  <FolderIcon className="w-4 h-4" />
                  <span className="truncate">{file.name}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Paper Outline */}
          <div className="flex-1">
            <div className="p-3 border-b border-gray-200">
              <h3 className="text-sm font-medium text-gray-700">Paper Outline</h3>
            </div>
            <div className="p-2 space-y-1">
              {documentSections.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => onSectionChange(section.id)}
                    className={`w-full flex items-center space-x-2 px-2 py-1 text-sm rounded text-left transition-colors ${
                      selectedSection === section.id
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="truncate">{section.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {activePanel === 'references' && (
        <div className="w-64 p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-700">References</h3>
            <button className="text-gray-400 hover:text-gray-600">
              <PlusIcon className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-2">
            <div className="text-sm text-gray-500">No references added yet</div>
            <button className="w-full px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg border border-dashed border-gray-300 hover:border-gray-400 transition-colors">
              Add Reference
            </button>
          </div>
        </div>
      )}

      {activePanel === 'discussion' && (
        <div className="w-64 p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-700">Discussion</h3>
            <button className="text-gray-400 hover:text-gray-600">
              <XMarkIcon className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-2">
            <div className="text-sm text-gray-500">Chat with AI assistant</div>
            <button className="w-full px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Start Chat
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 