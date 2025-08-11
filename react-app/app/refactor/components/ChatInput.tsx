'use client';

import React from 'react';
import { 
  PaperAirplaneIcon, 
  AtSymbolIcon,
  PhotoIcon
} from '@heroicons/react/24/outline';

interface ChatInputProps {
  inputValue: string;
  onInputChange: (value: string) => void;
  onSendMessage: () => void;
  onAddContext: () => void;
  onUploadImage: () => void;
}

export default function ChatInput({
  inputValue,
  onInputChange,
  onSendMessage,
  onAddContext,
  onUploadImage
}: ChatInputProps) {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSendMessage();
    }
  };

  return (
    <div className="p-4 border-t border-gray-200 text-xs text-black">
      <div className="space-y-1">
        {/* Row 1: Add context and manage context */}
        <div className="flex justify-start space-x-1">
          <button
            onClick={onAddContext}
            className="flex items-center justify-center space-x-2 p-1 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-xs"
          >
            <AtSymbolIcon className="w-4 h-4" />
            <span>Add context</span>
          </button>
        </div>
        
        {/* Row 2: Input text */}
        <div className="relative">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask for writing help..."
            className="w-full p-1 border border-gray-300 rounded-lg"
          />
        </div>
        
        {/* Row 3: Image upload and submit button */}
        <div className="flex justify-end space-x-2">
          <button
            onClick={onUploadImage}
            className="flex items-center justify-center space-x-2 p-1 hover:bg-gray-200 transition-colors text-gray-700"
          >
            <PhotoIcon className="w-4 h-4" />
          </button>
          <button
            onClick={onSendMessage}
            disabled={!inputValue.trim()}
            className="flex space-x-2 p-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <PaperAirplaneIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
} 