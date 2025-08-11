'use client';

import React, { useState } from 'react';
import ReferenceManagement from '@/app/editor/components/ReferenceManagement';
import PaperEditor from '@/app/editor/components/PaperEditor';
import AIChat from '@/app/editor/components/AIChat';
import { ViewColumnsIcon } from '@heroicons/react/24/outline';

export interface Reference {
  id: string;
  type: 'weblink' | 'figure' | 'pdf';
  title: string;
  url?: string;
  description?: string;
  tags?: string[];
  createdAt: Date;
}

export default function Editor() {
  // Sample data - in real app, this would come from API/database
  const [references, setReferences] = useState<Reference[]>([
    {
      id: '1',
      type: 'weblink',
      title: 'LaTeX Documentation',
      url: 'https://www.latex-project.org/help/documentation/',
      description: 'Official LaTeX documentation and guides',
      tags: ['documentation', 'latex'],
      createdAt: new Date('2024-01-15')
    },
    {
      id: '2',
      type: 'figure',
      title: 'Research Methodology Diagram',
      url: '/images/methodology.png',
      description: 'Visual representation of research methodology',
      tags: ['methodology', 'diagram'],
      createdAt: new Date('2024-01-16')
    },
    {
      id: '3',
      type: 'pdf',
      title: 'Academic Paper Template',
      url: '/papers/template.pdf',
      description: 'Standard academic paper template',
      tags: ['template', 'academic'],
      createdAt: new Date('2024-01-17')
    }
  ]);

  const [selectedReferences, setSelectedReferences] = useState<string[]>([]);
  const [paperContent, setPaperContent] = useState('');
  const [isReferencePanelCollapsed, setIsReferencePanelCollapsed] = useState(false);
  const [isChatPanelCollapsed, setIsChatPanelCollapsed] = useState(false);

  // Reference management functions
  const removeReference = (id: string) => {
    setReferences(prev => prev.filter(ref => ref.id !== id));
    setSelectedReferences(prev => prev.filter(refId => refId !== id));
  };

  const toggleReferenceSelection = (id: string) => {
    setSelectedReferences(prev => 
      prev.includes(id) 
        ? prev.filter(refId => refId !== id)
        : [...prev, id]
    );
  };

  // Panel collapse handlers
  const toggleReferencePanel = () => setIsReferencePanelCollapsed(!isReferencePanelCollapsed);
  const toggleChatPanel = () => setIsChatPanelCollapsed(!isChatPanelCollapsed);

  // Common button styles for collapse buttons
  const collapseButtonStyles = "absolute top-4 z-10 p-1 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors";
  
  // Common panel styles
  const panelStyles = "transition-all duration-300";
  const collapsedWidth = "w-12";
  const expandedWidth = "w-1/4";

  return (
    <div className="h-screen bg-gray-50 relative">
      <div className="h-full flex">
        {/* Reference Panel Toggle Button */}
        <button
          onClick={toggleReferencePanel}
          className={`${collapseButtonStyles} left-2`}
          title={isReferencePanelCollapsed ? "Expand panel" : "Collapse panel"}
        >
          <ViewColumnsIcon className="w-6 h-6"/>
        </button>

        {/* Left Panel - Reference Management */}
        <div className={`${panelStyles} ${isReferencePanelCollapsed ? collapsedWidth : expandedWidth}`}>
          {!isReferencePanelCollapsed && (
            <ReferenceManagement
              references={references}
              selectedReferences={selectedReferences}
              onRemoveReference={removeReference}
              onToggleSelection={toggleReferenceSelection}
            />
          )}
        </div>
        {/* Middle Panel - Paper Editor */}
        <div className="flex-1">
          <PaperEditor
            content={paperContent}
            onContentChange={setPaperContent}
            selectedReferences={references.filter(ref => selectedReferences.includes(ref.id))}
          />
        </div>
        
        {/* Right Panel - AI Chat */}
        <div className={`${panelStyles} ${isChatPanelCollapsed ? collapsedWidth : expandedWidth}`}>
          {!isChatPanelCollapsed && (
            <AIChat
              references={references}
              selectedReferences={selectedReferences}
              onToggleReferenceSelection={toggleReferenceSelection}
            />
          )}
          
          {/* Chat Panel Toggle Button */}
          <button
            onClick={toggleChatPanel}
            className={`${collapseButtonStyles} right-2`}
            title={isChatPanelCollapsed ? "Expand panel" : "Collapse panel"}
          >
            <ViewColumnsIcon className="w-6 h-6"/>
          </button>
        </div>
      </div>
    </div>
  );
} 