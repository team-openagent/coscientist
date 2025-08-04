'use client';

import React, { useState } from 'react';
import { 
  PlayIcon,
  DocumentArrowDownIcon,
  GlobeAltIcon,
  EyeIcon,
  ArrowsPointingOutIcon,
} from '@heroicons/react/24/outline';

interface PaperEditorProps {
  content: string;
  onContentChange: (content: string) => void;
  selectedSection: string;
}

export default function PaperEditor({ content, onContentChange, selectedSection }: PaperEditorProps) {
  const [isCompiling, setIsCompiling] = useState(false);
  const [layout, setLayout] = useState<'split' | 'editor' | 'pdf'>('split');

  const handleCompile = async () => {
    setIsCompiling(true);
    // Simulate compilation delay
    setTimeout(() => {
      setIsCompiling(false);
    }, 2000);
  };

  const handlePublish = () => {
    // Publish functionality
    console.log('Publishing document...');
  };

  const handleExport = () => {
    // Export functionality
    console.log('Exporting document...');
  };

  const handleQuickReview = () => {
    // Quick review functionality
    console.log('Starting quick review...');
  };

  const toggleLayout = () => {
    if (layout === 'split') setLayout('editor');
    else if (layout === 'editor') setLayout('pdf');
    else setLayout('split');
  };

  return (
    <div className="h-full bg-white flex flex-col">
      {/* Toolbar */}
      <div className="border-b border-gray-200 p-2 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <h1 className="text-lg font-semibold text-gray-800">LaTeX Editor</h1>
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {selectedSection.charAt(0).toUpperCase() + selectedSection.slice(1)}
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={handleCompile}
            disabled={isCompiling}
            className="cursor-pointer text-gray-600 hover:bg-gray-100 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title={isCompiling ? 'Compiling...' : 'Compile LaTeX to PDF'}
          >
            <PlayIcon className="w-5 h-5" />
          </button>
          
          <button
            onClick={handlePublish}
            className="cursor-pointer text-gray-600 hover:bg-gray-100 rounded transition-colors"
            title="Publish document online"
          >
            <GlobeAltIcon className="w-5 h-5" />
          </button>
          
          <button
            onClick={handleExport}
            className="cursor-pointer text-gray-600 hover:bg-gray-100 rounded transition-colors"
            title="Export to various formats"
          >
            <DocumentArrowDownIcon className="w-5 h-5" />
          </button>
          
          <button
            onClick={handleQuickReview}
            className="cursor-pointer text-gray-600 hover:bg-gray-100 rounded transition-colors"
            title="AI-powered quick review"
          >
            <EyeIcon className="w-5 h-5" />
          </button>
          
          <button
            onClick={toggleLayout}
            className="cursor-pointer text-gray-600 hover:bg-gray-100 rounded transition-colors"
            title="Toggle between split/editor/PDF views"
          >
            <ArrowsPointingOutIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      {/* Editor and PDF Split View */}
      <div className="flex-1 flex overflow-hidden">
        {/* Editor Panel */}
        <div className={`${layout === 'split' ? 'flex-1' : layout === 'editor' ? 'w-full' : 'w-0'} flex flex-col transition-all duration-300`}>
          <div className="flex-1 flex flex-col">
            {/* Code Editor with Line Numbers */}
            <div className="flex-1 flex overflow-hidden">
              {/* Line Numbers */}
              <div className="w-12 bg-gray-50 border-r border-gray-200 flex flex-col items-end py-2 select-none">
                {content.split('\n').map((_, index) => (
                  <div key={index} className="text-xs text-gray-500 px-2 py-0.5 font-mono">
                    {index + 1}
                  </div>
                ))}
              </div>
              
              {/* Code Textarea */}
              <div className="flex-1 relative">
                <textarea
                  value={content}
                  onChange={(e) => onContentChange(e.target.value)}
                  className="w-full h-full p-4 font-mono text-sm resize-none focus:outline-none bg-white text-black"
                  placeholder="Enter your LaTeX code here..."
                  style={{
                    lineHeight: '1.5',
                    paddingLeft: '1rem',
                    paddingTop: '0.5rem'
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Resizable Handle */}
        {layout === 'split' && (
          <div className="w-1 bg-gray-200 hover:bg-gray-300 transition-colors cursor-col-resize flex items-center justify-center">
            <div className="w-0.5 h-8 bg-gray-400 rounded-full"></div>
          </div>
        )}
        
        {/* PDF Panel */}
        <div className={`${layout === 'split' ? 'flex-1' : layout === 'pdf' ? 'w-full' : 'w-0'} flex flex-col transition-all duration-300`}>
          <div className="flex-1 flex flex-col">
            {/* PDF Viewer */}
            <div className="flex-1 bg-gray-100 flex items-center justify-center">
              <div className="w-full h-full max-w-4xl mx-auto bg-white shadow-lg">
                {/* PDF Content */}
                <div className="flex-1 overflow-y-auto p-8 text-black">
                  <div className="max-w-none">
                    <h1 className="text-3xl font-bold mb-6 text-center">My LaTeX Document</h1>
                    <p className="text-sm text-black mb-8 text-center"><strong>Author:</strong> Your Name</p>
                    <hr className="my-8" />
                    
                    <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
                    <p className="mb-4 leading-relaxed">Your content here...</p>
                    <p className="mb-4 leading-relaxed">This is a preview of how your LaTeX document will look when compiled.</p>
                    <p className="mb-4 leading-relaxed">You can see the formatted text, headings, and structure here.</p>
                    
                    <h2 className="text-2xl font-semibold mb-4 mt-8">Experiment</h2>
                    <p className="mb-4 leading-relaxed">Experimental setup and methodology details...</p>
                    
                    <h2 className="text-2xl font-semibold mb-4 mt-8">Discussion</h2>
                    <p className="mb-4 leading-relaxed">Analysis and discussion of results...</p>
                    
                    <h2 className="text-2xl font-semibold mb-4 mt-8">References</h2>
                    <p className="mb-4 leading-relaxed">Reference list will appear here...</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 