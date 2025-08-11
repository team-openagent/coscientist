'use client';

import React, { useState } from 'react';
import { Reference } from '../editor';
import { Topic, Message } from './types';
import ChatHead from './ChatHead';
import TopicList from './TopicList';
import ChatHistory from './ChatHistory';
import ChatInput from './ChatInput';

interface AIChatProps {
  references: Reference[];
  selectedReferences: string[];
  onToggleReferenceSelection: (id: string) => void;
}

export default function AIChat({
  references,
  selectedReferences,
  onToggleReferenceSelection
}: AIChatProps) {
  // Topic management state
  const [topics, setTopics] = useState<Topic[]>([
    {
      id: '1',
      title: 'General Writing Help',
      messages: [
        {
          id: '1',
          type: 'assistant',
          content: 'Hello! I\'m your AI writing assistant. I can help you with your document by analyzing your references and providing suggestions. You can add context from your references to get more specific help.',
          timestamp: new Date()
        }
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '2',
      title: 'Document Structure',
      messages: [
        {
          id: '1',
          type: 'assistant',
          content: 'I can help you organize your document structure. What type of document are you working on?',
          timestamp: new Date(Date.now() - 86400000) // 1 day ago
        }
      ],
      createdAt: new Date(Date.now() - 86400000),
      updatedAt: new Date(Date.now() - 86400000)
    },
    {
      id: '3',
      title: 'Reference Integration',
      messages: [
        {
          id: '1',
          type: 'assistant',
          content: 'Let\'s work on integrating your references effectively into your document.',
          timestamp: new Date(Date.now() - 172800000) // 2 days ago
        }
      ],
      createdAt: new Date(Date.now() - 172800000),
      updatedAt: new Date(Date.now() - 172800000)
    }
  ]);
  
  const [currentTopicId, setCurrentTopicId] = useState<string>('1');
  const [showAllTopics, setShowAllTopics] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isEditingTopic, setIsEditingTopic] = useState(false);
  const [editTopicTitle, setEditTopicTitle] = useState('');

  // Get current topic and messages
  const currentTopic = topics.find(topic => topic.id === currentTopicId);
  const messages = currentTopic?.messages || [];

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
      contextReferences: references.filter(ref => selectedReferences.includes(ref.id))
    };

    // Add message to current topic
    setTopics(prev => prev.map(topic => 
      topic.id === currentTopicId 
        ? {
            ...topic,
            messages: [...topic.messages, userMessage],
            updatedAt: new Date()
          }
        : topic
    ));
    
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: getAIResponse(inputValue, userMessage.contextReferences || []),
        timestamp: new Date()
      };
      
      // Add AI response to current topic
      setTopics(prev => prev.map(topic => 
        topic.id === currentTopicId 
          ? {
              ...topic,
              messages: [...topic.messages, aiResponse],
              updatedAt: new Date()
            }
          : topic
      ));
      
      setIsTyping(false);
    }, 1000);
  };

  const getAIResponse = (userInput: string, contextRefs: Reference[]): string => {
    const lowerInput = userInput.toLowerCase();
    let response = '';
    
    if (contextRefs.length > 0) {
      response += `Based on your selected references:\n`;
      contextRefs.forEach(ref => {
        response += `• ${ref.title} (${ref.type})\n`;
      });
      response += '\n';
    }
    
    if (lowerInput.includes('help') || lowerInput.includes('assist')) {
      response += 'I can help you with:\n• Writing suggestions\n• Reference integration\n• Document structure\n• Content analysis\n\nWhat specific aspect would you like help with?';
    } else if (lowerInput.includes('structure') || lowerInput.includes('outline')) {
      response += 'Here\'s a suggested document structure:\n\n1. Introduction\n2. Literature Review\n3. Methodology\n4. Results\n5. Discussion\n6. Conclusion\n\nWould you like me to elaborate on any section?';
    } else if (lowerInput.includes('reference') || lowerInput.includes('cite')) {
      response += 'I can help you integrate your references into your document. Select the references you want to use and I\'ll suggest how to incorporate them effectively.';
    } else {
      response += 'I\'m here to help with your writing! You can ask me about:\n• Document structure\n• Writing style\n• Reference integration\n• Content suggestions\n\nFeel free to add context from your references for more specific assistance.';
    }
    
    return response;
  };

  const handleAddContext = () => {
    // TODO: Implement file upload or context selection
    console.log('Add context clicked');
  };

  const handleCreateNewTopic = () => {
    const newTopic: Topic = {
      id: Date.now().toString(),
      title: 'New Conversation',
      messages: [
        {
          id: '1',
          type: 'assistant',
          content: 'Hello! I\'m your AI writing assistant. How can I help you with your document today?',
          timestamp: new Date()
        }
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setTopics(prev => [newTopic, ...prev]);
    setCurrentTopicId(newTopic.id);
  };

  const handleDeleteTopic = (topicId: string) => {
    if (topics.length <= 1) return; // Don't delete the last topic
    
    setTopics(prev => prev.filter(topic => topic.id !== topicId));
    
    // If we're deleting the current topic, switch to the first available topic
    if (topicId === currentTopicId) {
      const remainingTopics = topics.filter(topic => topic.id !== topicId);
      if (remainingTopics.length > 0) {
        setCurrentTopicId(remainingTopics[0].id);
      }
    }
  };

  const handleTopicClick = (topicId: string) => {
    setCurrentTopicId(topicId);
  };

  const handleEditTopic = () => {
    if (currentTopic) {
      setIsEditingTopic(true);
      setEditTopicTitle(currentTopic.title);
    }
  };

  const handleSaveTopicEdit = () => {
    if (editTopicTitle.trim()) {
      setTopics(prev => prev.map(topic => 
        topic.id === currentTopicId 
          ? { ...topic, title: editTopicTitle.trim() }
          : topic
      ));
    }
    setIsEditingTopic(false);
    setEditTopicTitle('');
  };

  const handleCancelTopicEdit = () => {
    setIsEditingTopic(false);
    setEditTopicTitle('');
  };

  const formatTopicTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString();
  };

  // Get topics to display (first 3 always, rest when expanded)
  const displayedTopics = showAllTopics ? topics : topics.slice(0, 2);
  const hasMoreTopics = topics.length > 2;



  return (
    <div className="h-full bg-white border-l border-gray-200 flex flex-col">
      <ChatHead
        currentTopicTitle={currentTopic ? currentTopic.title : 'Assistant'}
        isEditingTopic={isEditingTopic}
        editTopicTitle={editTopicTitle}
        onEditTopic={handleEditTopic}
        onSaveTopicEdit={handleSaveTopicEdit}
        onCancelTopicEdit={handleCancelTopicEdit}
        onEditTopicTitleChange={setEditTopicTitle}
        onCreateNewTopic={handleCreateNewTopic}
        hasCurrentTopic={!!currentTopic}
      />

      <TopicList
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
        onAddContext={handleAddContext}
        onUploadImage={() => console.log('Upload image clicked')}
      />
    </div>
  );
} 