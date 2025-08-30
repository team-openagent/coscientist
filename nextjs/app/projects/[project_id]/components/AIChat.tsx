'use client';

import React, { useState, useRef, useEffect } from 'react';
import { IReference, ITopic } from '@/domain/model';
import ChatHead from './ChatHead';
import ChatInput from './ChatInput';
import { getTypeIcon } from '../utils/referenceUtils';

interface Message {
  id: string;
  content: string;
  type: 'user' | 'assistant';
  timestamp: Date;
  contextReferences?: IReference[];
}

interface AIChatProps {
  references: IReference[];
  projectId: string;
}

export default function AIChat({
  references,
  projectId,
}: AIChatProps) {
  // Message and scroll management
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  
  // Topic management state
  const [topics, setTopics] = useState<ITopic[]>([]);
  const [currentTopic, setCurrentTopic] = useState<ITopic | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedContextReferences, setSelectedContextReferences] = useState<IReference[]>([]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    fetchTopics();
  }, [projectId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  async function fetchTopics() {
    try {
      const response = await fetch(`/api/project/${projectId}/topic`, {
        method: 'GET',
        headers: {'Content-Type': 'application/json'},
      });

      if (!response.ok) {
        throw new Error('Failed to fetch topics');
      }

      const fetchedTopics: ITopic[] = await response.json();
      console.log("Fetched topics: ", fetchedTopics);
      setTopics(fetchedTopics);

      // Set the current topic to the first topic if none is selected
      if (!currentTopic && fetchedTopics.length > 0) {
        setCurrentTopic(fetchedTopics[0]);
      }
    } catch (error) {
      console.error('Error fetching topics:', error);
      // TODO: Add error toast notification
    }
  }

  const handleAddContext = (reference: IReference) => {
    setSelectedContextReferences(prev => {
      // Check if reference already exists
      const exists = prev.some(ref => ref.id === reference.id);
      if (exists) return prev;
      return [...prev, reference];
    });
  };

  const handleSendMessage = async () => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      type: 'user',
      timestamp: new Date(),
      contextReferences: []
    };

    setMessages(prev => [...prev, newMessage]);
    setInputValue('');
    setIsTyping(true);

    // TODO: Add API call to send message and get response
    setIsTyping(false);
  };


  return (
    <div className="h-full bg-white border-l border-gray-200 flex flex-col">
      <ChatHead
        projectId={projectId}
        topics={topics}
        setTopics={setTopics}
        currentTopic={currentTopic}
        setCurrentTopic={setCurrentTopic}
      />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages?.map((message) => (
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

      <ChatInput
        inputValue={inputValue}
        onInputChange={setInputValue}
        onSendMessage={handleSendMessage}
        references={selectedContextReferences}
        onAddReference={handleAddContext}
        onRemoveReference={(reference: IReference) => {
          setSelectedContextReferences(prev => 
            prev.filter(ref => ref.id !== reference.id)
          );
        }}
        onUploadImage={() => console.log('Upload image clicked')}
      />
    </div>
  );
} 