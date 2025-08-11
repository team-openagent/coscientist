'use client';

import React, { useState } from 'react';
import BlockEditor, { Block } from './components/BlockEditor';

export default function BlockEditorDemo() {
  const [blocks, setBlocks] = useState<Block[]>([
    { id: '1', type: 'heading', content: 'Welcome to the Notion-style Block Editor' },
    { id: '2', type: 'paragraph', content: 'This is a powerful block-based editor that supports multiple content types and inline formatting.' },
    { id: '3', type: 'paragraph', content: 'Try typing "/" to see available commands, or select text to format it.' },
    { id: '4', type: 'bullet-list', content: 'Feature 1: Slash commands for block types' },
    { id: '5', type: 'bullet-list', content: 'Feature 2: Inline text formatting' },
    { id: '6', type: 'bullet-list', content: 'Feature 3: Auto-block creation and deletion' },
    { id: '7', type: 'quote', content: 'This editor provides a smooth, intuitive writing experience similar to Notion.' },
    { id: '8', type: 'ai-generation', content: 'AI can help generate content for your documents.' },
    { id: '9', type: 'figure', content: 'Add images, diagrams, or other visual content here.' },
  ]);

  const handleBlocksChange = (newBlocks: Block[]) => {
    setBlocks(newBlocks);
    console.log('Blocks updated:', newBlocks);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Block Editor Demo</h1>
          <p className="text-gray-600">
            A Notion-style block-based editor with slash commands, inline formatting, and responsive design.
          </p>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border-b border-blue-200 px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-lg font-semibold text-blue-900 mb-2">How to Use:</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
            <div>
              <h3 className="font-medium mb-1">Slash Commands:</h3>
              <ul className="space-y-1">
                <li>• Type "/" to open the command menu</li>
                <li>• Choose from Heading, Paragraph, Figure, AI Generation, etc.</li>
                <li>• Use arrow keys or mouse to navigate</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-1">Text Formatting:</h3>
              <ul className="space-y-1">
                <li>• Select text to see the format menu</li>
                <li>• Apply bold, italic, or code formatting</li>
                <li>• Use keyboard shortcuts (Ctrl+B, Ctrl+I)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Editor */}
      <div className="py-8">
        <BlockEditor
          content={blocks}
          onContentChange={handleBlocksChange}
        />
      </div>

      {/* Footer */}
      <div className="bg-white border-t border-gray-200 px-6 py-4">
        <div className="max-w-4xl mx-auto text-center text-sm text-gray-500">
          <p>Press Enter to create new blocks • Press Backspace on empty blocks to delete • Type "/" for commands</p>
        </div>
      </div>
    </div>
  );
} 