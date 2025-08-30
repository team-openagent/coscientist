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
        currentTopicId={currentTopicId}
        showAllTopics={showAllTopics}
        hasMoreTopics={hasMoreTopics}
        onTopicClick={handleTopicClick}
        onDeleteTopic={handleDeleteTopic}
        onToggleShowAllTopics={() => setShowAllTopics(!showAllTopics)}
        formatTopicTime={formatTopicTime}
      />

      <ChatHistory
        messages={messages}
        isTyping={isTyping}
      />

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