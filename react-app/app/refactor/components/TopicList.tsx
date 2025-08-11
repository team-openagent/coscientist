'use client';

import React from 'react';
import { 
  ChevronDownIcon, 
  ChevronUpIcon, 
  TrashIcon, 
  ChatBubbleLeftRightIcon 
} from '@heroicons/react/24/outline';

import { Topic } from './types';

interface TopicListProps {
  topics: Topic[];
  currentTopicId: string;
  showAllTopics: boolean;
  hasMoreTopics: boolean;
  onTopicClick: (topicId: string) => void;
  onDeleteTopic: (topicId: string) => void;
  onToggleShowAllTopics: () => void;
  formatTopicTime: (date: Date) => string;
}

export default function TopicList({
  topics,
  currentTopicId,
  showAllTopics,
  hasMoreTopics,
  onTopicClick,
  onDeleteTopic,
  onToggleShowAllTopics,
  formatTopicTime
}: TopicListProps) {
  const displayedTopics = showAllTopics ? topics : topics.slice(0, 2);

  return (
    <div className="border-b border-gray-200">
      <div className="p-1">
        <div className="space-y-1">
          {displayedTopics.map((topic) => (
            <div
              key={topic.id}
              className={`flex items-center justify-between p-1 rounded-lg cursor-pointer transition-colors ${
                topic.id === currentTopicId
                  ? 'bg-blue-50 border border-blue-200'
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => onTopicClick(topic.id)}
            >
              <div className="flex items-center space-x-2 flex-1 min-w-0">
                <ChatBubbleLeftRightIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-800 truncate">
                    {topic.title}
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatTopicTime(topic.updatedAt)}
                  </div>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteTopic(topic.id);
                }}
                className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                title="Delete conversation"
              >
                <TrashIcon className="w-3 h-3" />
              </button>
            </div>
          ))}
          
          {hasMoreTopics && (
            <button
              onClick={onToggleShowAllTopics}
              className="w-full flex items-center justify-center space-x-1 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors"
            >
              {showAllTopics ? (
                <>
                  <ChevronUpIcon className="w-4 h-4" />
                  <span>Show less</span>
                </>
              ) : (
                <>
                  <ChevronDownIcon className="w-4 h-4" />
                  <span>Show {topics.length - 2} more</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
} 