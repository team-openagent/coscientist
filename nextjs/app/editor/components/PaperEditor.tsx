'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  GlobeAltIcon, 
  ShareIcon, 
  DocumentArrowDownIcon
} from '@heroicons/react/24/outline';
import Header from '@editorjs/header';
import EditorJS from '@editorjs/editorjs';
import Image from '@editorjs/image';

interface EditorData {
  time: number;
  blocks: Array<{
    id: string;
    type: string;
    data: {
      text?: string;
      level?: number;
      url?: string;
      caption?: string;
    };
  }>;
  version: string;
}

interface PaperEditorProps {
  content: string;
  onContentChange: (content: string) => void;
}

export default function PaperEditor({
  content,
  onContentChange,
}: PaperEditorProps) {
  const editorRef = useRef<EditorJS | null>(null);
  const [editorData, setEditorData] = useState<EditorData | null>(null);

  // Initialize EditorJS
  useEffect(() => {
    if (editorRef.current) return;

    editorRef.current = new EditorJS({
      holder: "editorjs-container",
      data: {
        time: Date.now(),
        blocks: [
          {
            id: 'initial-block',
            type: 'paragraph',
            data: {
              text: content || 'Start writing your paper...'
            }
          }
        ],
        version: '2.28.2'
      },
      placeholder: 'Start writing your paper...',
      tools: {
        header: Header,
        image: {
          class: Image,
          config: {
            uploader: {
              uploadByFile: async (file: File) => {
                // For now, we'll create a placeholder URL
                // In a real app, you'd upload to your server/CDN
                return {
                  success: 1,
                  file: {
                    url: URL.createObjectURL(file),
                    name: file.name,
                    size: file.size
                  }
                };
              }
            }
          }
        }
      },
      onChange: async () => {
        if (editorRef.current) {
          const outputData = await editorRef.current.save();
          setEditorData(outputData as EditorData);
          
          // Convert blocks to string for backward compatibility
          const stringContent = outputData.blocks
            .map((block) => {
              if (block.type === 'paragraph') return block.data.text || '';
              if (block.type === 'header') return block.data.text || '';
              return '';
            })
            .filter((text: string) => text.trim())
            .join('\n\n');
          
          onContentChange(stringContent);
        }
      }
    });

    return () => {};
  }, []);

  const handlePublish = () => {
    console.log('Publishing document...', editorData);
  };

  const handleShare = () => {
    console.log('Sharing document...', editorData);
  };

  const handleExport = () => {
    console.log('Exporting document...', editorData);
  };

  return (
    <div className="h-full bg-white flex flex-col">
      {/* Toolbar */}
      <div className="border-b border-gray-200 p-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600"> </span>
        </div>
        
        {/* Right-aligned actions */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handlePublish}
            className="p-2 text-gray-600 hover:text-green-600 hover:bg-gray-100 rounded transition-colors"
            title="Publish document"
          >
            <GlobeAltIcon className="w-5 h-5" />
          </button>
          <button
            onClick={handleShare}
            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded transition-colors"
            title="Share document"
          >
            <ShareIcon className="w-5 h-5" />
          </button>
          <button
            onClick={handleExport}
            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors"
            title="Export document"
          >
            <DocumentArrowDownIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* EditorJS Container */}
      <div className="flex-1 overflow-auto text-black">
        <div 
          id="editorjs-container"
          className="h-full p-6"
          style={{ minHeight: 'calc(100vh - 80px)' }}
        />
      </div>
    </div>
  );
} 