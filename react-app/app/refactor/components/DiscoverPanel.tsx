'use client';

import React, { useState } from 'react';
import { XMarkIcon, PaperAirplaneIcon, ArrowTopRightOnSquareIcon, CheckIcon } from '@heroicons/react/24/outline';
import { getTypeIcon } from '../utils/referenceUtils';

interface DiscoverPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DiscoverPanel({ isOpen, onClose }: DiscoverPanelProps) {
  const [aiQuery, setAiQuery] = useState('');
  const [selectedRecommendations, setSelectedRecommendations] = useState<string[]>([]);

  if (!isOpen) return null;

  // Sample AI recommendations - in real app, this would come from AI API
  const aiRecommendations = [
    {
      id: '1',
      type: 'weblink' as const,
      title: 'Research Paper on Machine Learning',
      description: 'Recommended based on your document content',
      relevance: 'High'
    },
    {
      id: '2',
      type: 'pdf' as const,
      title: 'Statistical Analysis Guide',
      description: 'Related to your methodology section',
      relevance: 'Medium'
    },
    {
      id: '3',
      type: 'figure' as const,
      title: 'Data Visualization Examples',
      description: 'Perfect for your results section',
      relevance: 'High'
    },
    {
      id: '4',
      type: 'weblink' as const,
      title: 'Academic Writing Standards',
      description: 'Improves your document structure',
      relevance: 'Medium'
    }
  ];

  const handleAskAI = () => {
    if (aiQuery.trim()) {
      console.log('Asking AI:', aiQuery);
      // TODO: Implement AI query functionality
    }
  };

  const toggleRecommendation = (id: string) => {
    setSelectedRecommendations(prev => 
      prev.includes(id) 
        ? prev.filter(recId => recId !== id)
        : [...prev, id]
    );
  };

  const getRelevanceColor = (relevance: string) => {
    switch (relevance) {
      case 'High':
        return 'bg-green-100 text-green-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'Low':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-3/4 h-3/4 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Discover References</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="space-y-6">
            {/* AI Chat Input Section */}
            <div className="space-y-3">
              <h3 className="text-lg font-medium text-gray-800">Ask AI for Recommendations</h3>
              <div className="flex space-x-3">
                <input
                  type="text"
                  value={aiQuery}
                  onChange={(e) => setAiQuery(e.target.value)}
                  placeholder="Describe what you're looking for..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onKeyPress={(e) => e.key === 'Enter' && handleAskAI()}
                />
                <button
                  onClick={handleAskAI}
                  disabled={!aiQuery.trim()}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                >
                  <PaperAirplaneIcon className="w-4 h-4" />
                  <span>Ask</span>
                </button>
              </div>
              <p className="text-sm text-gray-500">
                Example: &ldquo;I need references about machine learning algorithms for my research paper&rdquo;
              </p>
            </div>

            {/* AI Recommendations Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <h3 className="text-lg font-medium text-gray-800">AI Recommendations</h3>
                  <ArrowTopRightOnSquareIcon className="w-5 h-5 text-gray-400" />
                </div>
                <span className="text-sm text-gray-500">{aiRecommendations.length} recommendations</span>
              </div>
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {aiRecommendations.map((recommendation) => (
                  <div 
                    key={recommendation.id}
                    className="bg-gray-50 p-3 rounded-lg border hover:bg-gray-100 transition-colors cursor-pointer"
                    onClick={() => toggleRecommendation(recommendation.id)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0 flex items-center justify-center w-8">
                        {getTypeIcon(recommendation.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium text-gray-800 truncate">
                            {recommendation.title}
                          </h4>
                        </div>
                        <p className="text-sm text-gray-600">
                          {recommendation.description}
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                          selectedRecommendations.includes(recommendation.id)
                            ? 'bg-blue-600 border-blue-600'
                            : 'border-gray-300 bg-white'
                        }`}>
                          {selectedRecommendations.includes(recommendation.id) && (
                            <CheckIcon className="w-3 h-3 text-white" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">
              AI recommendations are based on your document content and writing style
            </p>
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Import 
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 