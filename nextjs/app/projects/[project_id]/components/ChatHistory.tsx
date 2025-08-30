'use client';

import React, { useRef, useEffect } from 'react';
import { CheckpointTuple } from '@langchain/langgraph-checkpoint';

interface ChatHistoryProps {
  messages: CheckpointTuple[];
  isTyping: boolean;
}

export default function ChatHistory({ messages, isTyping }: ChatHistoryProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`max-w-xs px-4 py-2 rounded-lg ${
              message.type === 'user'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            <div className="whitespace-pre-wrap text-sm">{message.content}</div>
            {message.contextReferences && message.contextReferences.length > 0 && (
              <div className="mt-2 pt-2 border-t border-blue-200">
                <div className="text-xs text-blue-200 mb-1">Context:</div>
                {message.contextReferences.map((ref) => (
                  <div key={ref.id} className="text-xs text-blue-200 flex items-center space-x-1">
                    {getTypeIcon(ref.type)}
                    <span>{ref.title}</span>
                  </div>
                ))}
              </div>
            )}
            <div className={`text-xs mt-1 ${
              message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
            }`}>
              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        </div>
      ))}
      
      {isTyping && (
        <div className="flex justify-start">
          <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        </div>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
} 