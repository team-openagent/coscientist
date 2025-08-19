'use client';

import React from 'react';
import { PencilIcon, PlusIcon } from '@heroicons/react/24/outline';

interface ChatHeadProps {
  currentTopicTitle: string;
  isEditingTopic: boolean;
  editTopicTitle: string;
  onEditTopic: () => void;
  onSaveTopicEdit: () => void;
  onCancelTopicEdit: () => void;
  onEditTopicTitleChange: (value: string) => void;
  onCreateNewTopic: () => void;
  hasCurrentTopic: boolean;
}

export default function ChatHead({
  currentTopicTitle,
  isEditingTopic,
  editTopicTitle,
  onEditTopic,
  onSaveTopicEdit,
  onCancelTopicEdit,
  onEditTopicTitleChange,
  onCreateNewTopic,
  hasCurrentTopic
}: ChatHeadProps) {
  return (
    <div className="p-2 border-b border-gray-200">
      <div className="flex items-center justify-start">
        {isEditingTopic ? (
          <div className="p-1 border-b border-gray-200">
            <input
              type="text"
              value={editTopicTitle}
              onChange={(e) => onEditTopicTitleChange(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && onSaveTopicEdit()}
              onBlur={onSaveTopicEdit}
              className="text-sm font-semibold text-gray-800 bg-transparent border-b border-blue-500 focus:outline-none focus:border-blue-600"
              placeholder="Enter topic title..."
              autoFocus
            />
            <button
              onClick={onSaveTopicEdit}
              disabled={!editTopicTitle.trim()}
              className="p-1 text-green-600 hover:text-green-700 hover:bg-green-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Save"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </button>
            <button
              onClick={onCancelTopicEdit}
              className="p-1 text-gray-600 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
              title="Cancel"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ) : (
          <div className="p-1 border-gray-200">
            <p className="overflow-hidden text-ellipsis whitespace-nowrap text-sm font-semibold text-gray-800 max-w-[200px]">
              {currentTopicTitle}
            </p>
            <button
              onClick={onEditTopic}
              disabled={!hasCurrentTopic}
              className="p-1 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Edit topic title"
            >
              <PencilIcon className="w-4 h-4" />
            </button>
            <button
              onClick={onCreateNewTopic}
              className="p-1 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              title="New conversation"
            >
              <PlusIcon className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 