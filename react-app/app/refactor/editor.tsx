'use client';

import React, { useState } from 'react';
import ReferenceManagement from '@/app/refactor/components/ReferenceManagement';
import PaperEditor from '@/app/refactor/components/PaperEditor';
import AIChat from '@/app/refactor/components/AIChat';
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

  const addReference = (reference: Omit<Reference, 'id' | 'createdAt'>) => {
    const newReference: Reference = {
      ...reference,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    setReferences(prev => [...prev, newReference]);
  };

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

  return (
    <div className="h-screen bg-gray-50 relative">
      <div className="h-full flex">
        {/* Collapse/Expand Button */}
        <button
          onClick={() => setIsReferencePanelCollapsed(!isReferencePanelCollapsed)}
          className="absolute top-4 left-2 z-10 p-1 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors"
          title={isReferencePanelCollapsed ? "Expand panel" : "Collapse panel"}
        >
          <ViewColumnsIcon className="w-6 h-6"/>
        </button>
        {/* Left Panel - Reference Management */}
        <div className={`transition-all duration-300 ${isReferencePanelCollapsed ? 'w-12' : 'w-2/9'}`}>
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
        <div className={`transition-all duration-300 ${isChatPanelCollapsed ? 'w-12' : 'w-2/9'}`}>
          {!isChatPanelCollapsed && (
            <AIChat
              references={references}
              selectedReferences={selectedReferences}
              onToggleReferenceSelection={toggleReferenceSelection}
            />
          )}
          {/* Collapse/Expand Button */}
          <button
            onClick={() => setIsChatPanelCollapsed(!isChatPanelCollapsed)}
            className="absolute top-4 right-2 p-1 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors"
            title="Expand panel"
          >
            <ViewColumnsIcon className="w-6 h-6"/>
          </button>
        </div>
      </div>
    </div>
  );
} 