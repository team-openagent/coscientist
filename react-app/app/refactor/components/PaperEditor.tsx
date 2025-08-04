'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  GlobeAltIcon, 
  ShareIcon, 
  DocumentArrowDownIcon,
  PlusIcon,
  ListBulletIcon,
  ChatBubbleLeftRightIcon,
  CommandLineIcon,
  DocumentTextIcon,
  BookmarkIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { Reference } from '../editor';

interface PaperEditorProps {
  content: string;
  onContentChange: (content: string) => void;
  selectedReferences: Reference[];
}

export default function PaperEditor({
  content,
  onContentChange,
  selectedReferences
}: PaperEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentBlock, setCurrentBlock] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ x: 0, y: 0 });
  const editorRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showDropdown && !editorRef.current?.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  const dropdownOptions = [
    { id: 'heading', label: 'Heading', icon: '#' },
    { id: 'paragraph', label: 'Paragraph', icon: DocumentTextIcon },
    { id: 'reference', label: 'Reference', icon: BookmarkIcon },
    { id: 'ai-generation', label: 'AI Generation', icon: SparklesIcon }
  ];

  const handleEditorClick = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setDropdownPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    setShowDropdown(true);
  };

  const handleDropdownSelect = (optionId: string) => {
    setShowDropdown(false);
    switch (optionId) {
      case 'heading':
        insertBlock('heading');
        break;
      case 'paragraph':
        insertBlock('paragraph');
        break;
      case 'reference':
        console.log('Add reference');
        break;
      case 'ai-generation':
        console.log('AI generation');
        break;
    }
  };

  const handlePublish = () => {
    console.log('Publishing document...');
  };

  const handleShare = () => {
    console.log('Sharing document...');
  };

  const handleExport = () => {
    console.log('Exporting document...');
  };

  const insertBlock = (type: string) => {
    const newContent = content + '\n\n' + getBlockTemplate(type);
    onContentChange(newContent);
  };

  const getBlockTemplate = (type: string) => {
    switch (type) {
      case 'heading':
        return '# Heading';
      case 'paragraph':
        return 'Start typing...';
      case 'bullet':
        return '• List item';
      case 'numbered':
        return '1. Numbered item';
      case 'quote':
        return '> Quote';
      case 'code':
        return '```\nCode block\n```';
      default:
        return '';
    }
  };

  const formatText = (format: string) => {
    const textarea = document.querySelector('textarea');
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);

    let formattedText = '';
    switch (format) {
      case 'bold':
        formattedText = `**${selectedText}**`;
        break;
      case 'italic':
        formattedText = `*${selectedText}*`;
        break;
      case 'code':
        formattedText = `\`${selectedText}\``;
        break;
    }

    const newContent = content.substring(0, start) + formattedText + content.substring(end);
    onContentChange(newContent);
  };

  return (
    <div className="h-full bg-white flex flex-col">
      {/* Toolbar */}
      <div className="border-b border-gray-200 p-3 flex items-center justify-between">
        <div className="flex items-center space-x-1">
          {/* Formatting Tools */}
          <button
            onClick={() => formatText('bold')}
            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors"
            title="Bold"
          >
            <span className="w-4 h-4 font-bold text-center">B</span>
          </button>
          <button
            onClick={() => formatText('italic')}
            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors"
            title="Italic"
          >
            <span className="w-4 h-4 italic text-center">I</span>
          </button>
          <button
            onClick={() => formatText('code')}
            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors"
            title="Code"
          >
            <CommandLineIcon className="w-4 h-4" />
          </button>
          
          <div className="w-px h-6 bg-gray-300 mx-2"></div>
          
          {/* Block Insertion */}
          <button
            onClick={() => insertBlock('heading')}
            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors"
            title="Add heading"
          >
            <PlusIcon className="w-4 h-4" />
          </button>
          <button
            onClick={() => insertBlock('bullet')}
            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors"
            title="Add bullet list"
          >
            <ListBulletIcon className="w-4 h-4" />
          </button>
          <button
            onClick={() => insertBlock('numbered')}
            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors"
            title="Add numbered list"
          >
            <span className="w-4 h-4 text-center">1.</span>
          </button>
          <button
            onClick={() => insertBlock('quote')}
            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors"
            title="Add quote"
          >
            <ChatBubbleLeftRightIcon className="w-4 h-4" />
          </button>
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

      {/* Selected References */}
      {selectedReferences.length > 0 && (
        <div className="px-4 py-2 bg-blue-50 border-b border-blue-200">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-blue-800">Selected References:</span>
            <div className="flex flex-wrap gap-1">
              {selectedReferences.map((ref) => (
                <span
                  key={ref.id}
                  className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full"
                >
                  {ref.title}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Editor */}
      <div ref={editorRef} className="flex-1 p-6 text-black relative">
        <div className="max-w-4xl mx-auto">
          <div className="prose prose-lg max-w-none">
            <textarea
              value={content}
              onChange={(e) => onContentChange(e.target.value)}
              onClick={handleEditorClick}
              className="w-full h-full min-h-[500px] p-0 border-0 resize-none focus:outline-none font-sans text-lg leading-relaxed text-black"
              placeholder="Start writing your document..."
              style={{
                fontFamily: 'inherit',
                fontSize: '1.125rem',
                lineHeight: '1.75'
              }}
            />
          </div>
        </div>

        {/* Dropdown Menu */}
        {showDropdown && (
          <div
            className="absolute bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[200px]"
            style={{
              left: dropdownPosition.x,
              top: dropdownPosition.y + 20
            }}
          >
            {dropdownOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => handleDropdownSelect(option.id)}
                className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                {typeof option.icon === 'string' ? (
                  <span className="w-4 h-4 text-center font-bold">{option.icon}</span>
                ) : (
                  <option.icon className="w-4 h-4" />
                )}
                <span>{option.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="px-4 py-2 bg-gray-50 border-t border-gray-200 flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center space-x-4">
          <span>{content.length} characters</span>
          <span>{content.split('\n').length} lines</span>
          <span>{content.split(' ').filter(word => word.length > 0).length} words</span>
        </div>
        <div className="flex items-center space-x-2">
          <span>Auto-saved</span>
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        </div>
      </div>
    </div>
  );
} 