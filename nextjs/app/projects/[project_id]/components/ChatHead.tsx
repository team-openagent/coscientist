'use client';

import React, { useEffect, useState } from 'react';
import { 
  PencilIcon, 
  PlusIcon,
  ChevronDownIcon, 
  ChevronUpIcon, 
  TrashIcon, 
  ChatBubbleLeftRightIcon 
} from '@heroicons/react/24/outline';
import { ITopic } from '@/lib/mongo/model';
import { Types } from 'mongoose';
import { fetchWithAuth } from '@/lib/utils';

const API_ENDPOINTS = {
  create: (projectId: string) => `/api/project/${projectId}/topic`,
  delete: (projectId: string, topicId: string) => `/api/project/${projectId}/topic/${topicId}`,
  update: (projectId: string, topicId: string) => `/api/project/${projectId}/topic/${topicId}`,
};

async function createTopic(projectId: string): Promise<ITopic> {
  const response = await fetchWithAuth(API_ENDPOINTS.create(projectId), {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({title: 'New Chat'}),
  });

  return response.json();
}

async function deleteTopic(projectId: string, topicId: Types.ObjectId): Promise<void> {
  const response = await fetchWithAuth(API_ENDPOINTS.delete(projectId, topicId.toString()), {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw Error('Failed to delete topic');
  }
}

async function updateTopic(projectId: string, topicId: string, newTitle: string): Promise<Topic> {
  const response = await fetchWithAuth(API_ENDPOINTS.update(projectId, topicId), {
    method: 'PUT',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ title: newTitle }),
  });

  if (!response.ok) {
    throw new Error('Failed to update topic name');
  }
  return response.json();
}

interface ChatHeadProps {
  projectId: string;
  topics: ITopic[];
  setTopics: React.Dispatch<React.SetStateAction<ITopic[]>>;
  currentTopic: ITopic | null;
  setCurrentTopic: React.Dispatch<React.SetStateAction<ITopic | null>>;
}


export default function ChatHead({
  projectId,
  topics,
  setTopics,
  currentTopic,
  setCurrentTopic
}: ChatHeadProps) {
  const [isTopicEditing, setIsTopicEditing] = useState(false);
  const [newTopicTitle, setNewTopicTitle] = useState('');
  const [showAllTopics, setShowAllTopics] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("Fetched topics: ", topics);
  }, [topics]);

  const handleEditTopic = () => {
    if (currentTopic) {
      setIsTopicEditing(true);
      setNewTopicTitle(currentTopic.title);
    }
  };

  const handleSaveTopicName = async () => {
    if (!newTopicTitle.trim() || !currentTopic) return;
    try {
      setIsLoading(true);
      const updatedTopic = await updateTopic(projectId, currentTopic._id.toString(), newTopicTitle.trim());
      console.log("Updated topic: ", updatedTopic);
      setTopics(prev => prev.map(topic => topic._id === updatedTopic._id ? updatedTopic : topic));
      setCurrentTopic(updatedTopic);
    } catch (error) {
      setError('Failed to update topic name');
    } finally {
      setIsLoading(false);
      setIsTopicEditing(false);
      setNewTopicTitle('');
    }
  };

  const handleCancelTopicEdit = () => {
    setIsTopicEditing(false);
    setNewTopicTitle('');
  };

  const handleCreateNewTopic = async () => {
    try {
      setIsLoading(true);
      const newTopic = await createTopic(projectId);
      setTopics(prev => [...prev, newTopic]);
      setCurrentTopic(newTopic);
    } catch (error) {
      setError('Failed to create new topic');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTopic = async (topicId: Types.ObjectId) => {
    try {
      setIsLoading(true);
      await deleteTopic(projectId, topicId);
      setTopics(prev => prev.filter(topic => topic._id !== topicId));
      if (currentTopic?.id === topicId) {
        const latestTopic = topics.filter(topic => topic._id !== topicId).sort((a, b) => b.last_used_at.getTime() - a.last_used_at.getTime())[0];
        setCurrentTopic(latestTopic);
      }
    } catch (error) {
      setError('Failed to delete topic');
    } finally {
      setIsLoading(false);
    }
  };

  const formatTopicTime = (topic: ITopic) => {
    const lastUsedAt = new Date(topic.last_used_at);
    const diff = Date.now() - lastUsedAt.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return lastUsedAt.toLocaleDateString();
  };

  const displayedTopics = showAllTopics ? topics : topics.slice(0, 2);
  const hasMoreTopics = topics.length > 2;

  return (
    <div className="border-b border-gray-200">
      {error && (
        <div className="p-2 bg-red-50 border-b border-red-200">
          <p className="text-sm text-red-600">{error}</p>
          <button
            onClick={() => setError(null)}
            className="absolute top-2 right-2 text-red-400 hover:text-red-600"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
      <div className="p-2 border-b border-gray-200">
        <div className="flex items-center justify-start">
          {isTopicEditing ? (
            <div className="p-1 border-b border-gray-200">
              <input
                type="text"
                value={newTopicTitle}
                onChange={(e) => setNewTopicTitle(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSaveTopicName()}
                onBlur={handleCancelTopicEdit}
                className="text-sm font-semibold text-gray-800 bg-transparent border-b border-blue-500 focus:outline-none focus:border-blue-600"
                placeholder="Enter topic title..."
                autoFocus
              />
              <button
                onClick={handleSaveTopicName}
                disabled={!newTopicTitle.trim() || isLoading}
                className="p-1 text-green-600 hover:text-green-700 hover:bg-green-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Save"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </button>
              <button
                onClick={handleCancelTopicEdit}
                disabled={isLoading}
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
                {currentTopic?.title}
              </p>
              <button
                onClick={handleEditTopic}
                disabled={!currentTopic || isLoading}
                className="p-1 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Edit topic title"
              >
                <PencilIcon className="w-4 h-4" />
              </button>
              <button
                onClick={handleCreateNewTopic}
                disabled={isLoading}
                className="p-1 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                title="New conversation"
              >
                <PlusIcon className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="p-1">
        <div className="space-y-1">
          {displayedTopics.map((topic) => (
            <div
              key={topic._id.toString()}
              className={`flex items-center justify-between p-1 rounded-lg cursor-pointer transition-colors ${
                topic.id === currentTopic?._id
                  ? 'bg-blue-50 border border-blue-200'
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => setCurrentTopic(topic)}
            >
              <div className="flex items-center space-x-2 flex-1 min-w-0">
                <ChatBubbleLeftRightIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-800 truncate">
                    {topic.title}
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatTopicTime(topic)}
                  </div>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteTopic(topic._id);
                }}
                disabled={isLoading}
                className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Delete conversation"
              >
                <TrashIcon className="w-3 h-3" />
              </button>
            </div>
          ))}
          
          {hasMoreTopics && (
            <button
              onClick={() => setShowAllTopics(!showAllTopics)}
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