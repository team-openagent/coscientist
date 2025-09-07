'use client';

import React, { useState } from 'react';
import { useStreamCompletion } from '@/hooks/useStreamCompletion';

interface StreamData {
  input_query?: string;
  reasonings?: any[];
  plans?: any[];
  new_draft?: any[];
  final_draft?: any[];
}

export default function StreamCompletionExample() {
  const [inputQuery, setInputQuery] = useState('');
  const [streamData, setStreamData] = useState<StreamData>({});
  const [messages, setMessages] = useState<string[]>([]);

  const { stream, isStreaming, error, reset } = useStreamCompletion({
    onChunk: (chunk) => {
      console.log('Received chunk:', chunk);
      
      // Update stream data with latest chunk
      setStreamData(prev => ({
        ...prev,
        ...chunk
      }));

      // Add message to chat
      if (chunk.input_query) {
        setMessages(prev => [...prev, `Query: ${chunk.input_query}`]);
      }
      
      if (chunk.reasonings && chunk.reasonings.length > 0) {
        const latestReasoning = chunk.reasonings[chunk.reasonings.length - 1];
        setMessages(prev => [...prev, `Reasoning: ${latestReasoning}`]);
      }

      if (chunk.plans && chunk.plans.length > 0) {
        const latestPlan = chunk.plans[chunk.plans.length - 1];
        setMessages(prev => [...prev, `Plan: ${latestPlan.task}`]);
      }

      if (chunk.new_draft && chunk.new_draft.length > 0) {
        const latestDraft = chunk.new_draft[chunk.new_draft.length - 1];
        setMessages(prev => [...prev, `New Draft: ${JSON.stringify(latestDraft)}`]);
      }

      if (chunk.final_draft && chunk.final_draft.length > 0) {
        const latestFinalDraft = chunk.final_draft[chunk.final_draft.length - 1];
        setMessages(prev => [...prev, `Final Draft: ${JSON.stringify(latestFinalDraft)}`]);
      }
    },
    onComplete: () => {
      console.log('Stream completed');
      setMessages(prev => [...prev, '✅ Stream completed']);
    },
    onError: (error) => {
      console.error('Stream error:', error);
      setMessages(prev => [...prev, `❌ Error: ${error}`]);
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuery.trim() || isStreaming) return;

    // Clear previous data
    setStreamData({});
    setMessages([]);
    
    // Start streaming
    await stream(inputQuery);
  };

  const handleReset = () => {
    reset();
    setStreamData({});
    setMessages([]);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">AI Agent Stream Example</h1>
      
      {/* Input Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="query" className="block text-sm font-medium text-gray-700 mb-2">
            Enter your query:
          </label>
          <textarea
            id="query"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="e.g., Write abstract of a research paper on renewable energy"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            rows={3}
            disabled={isStreaming}
          />
        </div>
        
        <div className="flex space-x-3">
          <button
            type="submit"
            disabled={!inputQuery.trim() || isStreaming}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isStreaming ? 'Processing...' : 'Start Stream'}
          </button>
          
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            Reset
          </button>
        </div>
      </form>

      {/* Error Display */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-800">Error: {error}</p>
        </div>
      )}

      {/* Status */}
      {isStreaming && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-blue-800">🔄 Processing your request...</p>
        </div>
      )}

      {/* Messages */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Stream Messages</h2>
        <div className="bg-gray-50 border border-gray-200 rounded-md p-4 max-h-96 overflow-y-auto">
          {messages.length === 0 ? (
            <p className="text-gray-500 text-center">No messages yet. Start a stream to see results.</p>
          ) : (
            <div className="space-y-2">
              {messages.map((message, index) => (
                <div key={index} className="p-2 bg-white rounded border">
                  <p className="text-sm text-gray-800">{message}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Stream Data Display */}
      {Object.keys(streamData).length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Stream Data</h2>
          <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
            <pre className="text-sm text-gray-800 overflow-x-auto">
              {JSON.stringify(streamData, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
