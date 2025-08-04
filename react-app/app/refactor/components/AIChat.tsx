'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  PaperAirplaneIcon, 
  SparklesIcon,
  PlusIcon,
  XMarkIcon,
  LinkIcon,
  PhotoIcon,
  DocumentIcon,
  AtSymbolIcon,
  ViewColumnsIcon
} from '@heroicons/react/24/outline';
import { Reference } from '../editor';

interface AIChatProps {
  references: Reference[];
  selectedReferences: string[];
  onToggleReferenceSelection: (id: string) => void;
}

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  contextReferences?: Reference[];
}

export default function AIChat({
  references,
  selectedReferences,
  onToggleReferenceSelection
}: AIChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: 'Hello! I\'m your AI writing assistant. I can help you with your document by analyzing your references and providing suggestions. You can add context from your references to get more specific help.',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
      contextReferences: references.filter(ref => selectedReferences.includes(ref.id))
    };

    setMessages(prev => [...prev, userMessage]);
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
      setMessages(prev => [...prev, aiResponse]);
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

  const addContextFromReferences = () => {
    setShowContextMenu(!showContextMenu);
  };

  const handleAddContext = () => {
    // TODO: Implement file upload or context selection
    console.log('Add context clicked');
  };

  const getTypeIcon = (type: Reference['type']) => {
    switch (type) {
      case 'weblink':
        return <LinkIcon className="w-4 h-4 text-blue-500" />;
      case 'figure':
        return <PhotoIcon className="w-4 h-4 text-green-500" />;
      case 'pdf':
        return <DocumentIcon className="w-4 h-4 text-red-500" />;
    }
  };

  return (
    <div className="h-full bg-white border-l border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
      <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Assistant</h2>
          </div>
        </div>
      </div>
      
      {/* Messages */}
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
      
      {/* Input */}
      <div className="p-4 border-t border-gray-200 text-xs text-black">
        <div className="space-y-1">
          {/* Row 1: Add context and manage context */}
          <div className="flex justify-start space-x-1">
            <button
              onClick={handleAddContext}
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
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask for writing help..."
              className="w-full p-1 border border-gray-300 rounded-lg"
            />
          </div>
          
          {/* Row 3: Image upload and submit button */}
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => console.log('Upload image clicked')}
              className="flex items-center justify-center space-x-2 p-1 hover:bg-gray-200 transition-colors text-gray-700"
            >
              <PhotoIcon className="w-4 h-4" />
            </button>
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim()}
              className="flex space-x-2 p-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <PaperAirplaneIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 