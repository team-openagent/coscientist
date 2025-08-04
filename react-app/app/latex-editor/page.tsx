'use client';

import React, { useState } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import NavigationRail from './components/NavigationRail';
import PaperEditor from './components/PaperEditor';
import ChatPanel from './components/ChatPanel';

export default function LatexEditorPage() {
  const [selectedSection, setSelectedSection] = useState('abstraction');
  const [latexContent, setLatexContent] = useState('\\documentclass{article}\n\\begin{document}\n\\title{My LaTeX Document}\n\\author{Your Name}\n\\maketitle\n\n\\section{Introduction}\nYour content here...\n\n\\end{document}');

  return (
    <div className="h-screen bg-gray-50">
      <PanelGroup direction="horizontal" className="h-full">
        {/* Left Panel - Navigation Rail */}
        <Panel defaultSize={20} minSize={15} maxSize={30}>
          <NavigationRail 
            selectedSection={selectedSection}
            onSectionChange={setSelectedSection}
          />
        </Panel>
        
        <PanelResizeHandle className="w-1 bg-gray-200 hover:bg-gray-300 transition-colors" />
        
        {/* Middle Panel - Paper Editor */}
        <Panel defaultSize={60} minSize={40}>
          <PaperEditor 
            content={latexContent}
            onContentChange={setLatexContent}
            selectedSection={selectedSection}
          />
        </Panel>
        
        <PanelResizeHandle className="w-1 bg-gray-200 hover:bg-gray-300 transition-colors" />
        
        {/* Right Panel - AI Chat */}
        <Panel defaultSize={20} minSize={15} maxSize={35}>
          <ChatPanel />
        </Panel>
      </PanelGroup>
    </div>
  );
} 