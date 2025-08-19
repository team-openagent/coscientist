'use client';

import React, { useState, useEffect, use } from 'react';
import { IReference } from '@/domain/model';
import { ViewColumnsIcon } from '@heroicons/react/24/outline';
import dynamic from 'next/dynamic';
const PaperEditor = dynamic(() => import('@/app/projects/[project_id]/components/PaperEditor'), {
  ssr: false,
});
import ReferenceManagement from '@/app/projects/[project_id]/components/ReferenceManagement';
import AIChat from '@/app/projects/[project_id]/components/AIChat';

interface PathParams { 
  project_id: string;
}

export default function Editor({params}: {params: Promise<PathParams>}) {
  const [references, setReferences] = useState<IReference[]>([]);
  const [paperContent, setPaperContent] = useState('');
  const [isReferencePanelCollapsed, setIsReferencePanelCollapsed] = useState(false);
  const [isChatPanelCollapsed, setIsChatPanelCollapsed] = useState(false);

  const projectId = use(params).project_id;

  useEffect(() => {
    fetchReferences(projectId);
  }, [projectId]);

  const updateReferences = () => {
    fetchReferences(projectId);
  };

  const fetchReferences = async (projectId: string) => {
    const response = await fetch(`/api/project/${projectId}/reference`);
    const data = await response.json();
    setReferences(data.references);
  };

  const addReference = (reference: IReference) => {
    setReferences(prev => [...prev, reference]);
  };

  // Reference management functions
  const removeReference = async (id: string) => {
    const response = await fetch(`/api/project/${projectId}/reference/${id}`, {
      method: 'DELETE',
    });
    
    if (response.ok) {
      // Remove reference from local state on successful deletion
      setReferences(prev => prev.filter(ref => ref._id.toString() !== id));
    } else {
      const errorData = await response.json();
      console.error('Failed to delete reference:', errorData.error);
      // You can add a toast notification here to show the error to the user
    }
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
              projectId={projectId}
              references={references}
              onRemoveReference={removeReference}
              onAddReference={addReference}
            />
          )}
        </div>
        {/* Middle Panel - Paper Editor */}
        <div className="flex-1">
          <PaperEditor
            content={paperContent}
            onContentChange={setPaperContent}
          />
        </div>
        
        {/* Right Panel - AI Chat */}
        <div className={`${panelStyles} ${isChatPanelCollapsed ? collapsedWidth : expandedWidth}`}>
          {!isChatPanelCollapsed && (
            <AIChat references={references} />
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
