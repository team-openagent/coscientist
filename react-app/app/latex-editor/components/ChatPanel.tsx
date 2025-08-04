'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  PaperAirplaneIcon, 
  SparklesIcon,
  LightBulbIcon,
  DocumentTextIcon,
  CalculatorIcon,
  PaperClipIcon
} from '@heroicons/react/24/outline';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function ChatPanel() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: 'Hello! I\'m your LaTeX assistant. I can help you with writing LaTeX code, formatting equations, creating tables, and more. What would you like to work on?',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
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
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: getAIResponse(inputValue),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000);
  };

  const getAIResponse = (userInput: string): string => {
    const lowerInput = userInput.toLowerCase();
    
    if (lowerInput.includes('equation') || lowerInput.includes('math')) {
      return 'Here\'s how to create an equation in LaTeX:\n\n```latex\n\\begin{equation}\nE = mc^2\n\\end{equation}\n```\n\nFor inline math, use `$E = mc^2$`. For display math, use `$$E = mc^2$$`.';
    }
    
    if (lowerInput.includes('table')) {
      return 'Here\'s a basic table structure:\n\n```latex\n\\begin{table}[h]\n\\centering\n\\begin{tabular}{|c|c|c|}\n\\hline\nHeader 1 & Header 2 & Header 3 \\\\\n\\hline\nData 1 & Data 2 & Data 3 \\\\\n\\hline\n\\end{tabular}\n\\caption{Your table caption}\n\\end{table}\n```';
    }
    
    if (lowerInput.includes('figure') || lowerInput.includes('image')) {
      return 'To insert a figure:\n\n```latex\n\\begin{figure}[h]\n\\centering\n\\includegraphics[width=0.5\\textwidth]{image.png}\n\\caption{Your figure caption}\n\\label{fig:label}\n\\end{figure}\n```';
    }
    
    if (lowerInput.includes('section')) {
      return 'To create sections:\n\n```latex\n\\section{Introduction}\nYour content here...\n\n\\subsection{Subsection Title}\nMore content...\n\n\\subsubsection{Sub-subsection Title}\nEven more content...\n```';
    }
    
    return 'I can help you with LaTeX formatting, equations, tables, figures, citations, and more. Try asking about specific LaTeX commands or what you\'re trying to achieve!';
  };

  const quickPrompts = [
    { icon: CalculatorIcon, text: 'Help with equations', prompt: 'How do I write mathematical equations in LaTeX?' },
    { icon: DocumentTextIcon, text: 'Format document', prompt: 'How do I format my LaTeX document properly?' },
    { icon: LightBulbIcon, text: 'LaTeX tips', prompt: 'What are some useful LaTeX tips and tricks?' }
  ];

  const handleQuickPrompt = (prompt: string) => {
    setInputValue(prompt);
  };

  const handleAddContext = () => {
    // TODO: Implement file upload or context selection
    console.log('Add context clicked');
  };

  return (
    <div className="h-full bg-white border-l border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <SparklesIcon className="w-6 h-6 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-800">AI Assistant</h2>
        </div>
        <p className="text-sm text-gray-500 mt-1">Ask me anything about LaTeX!</p>
      </div>
      
      {/* Quick Prompts */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Quick Prompts</h3>
        <div className="space-y-2">
          {quickPrompts.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={index}
                onClick={() => handleQuickPrompt(item.prompt)}
                className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{item.text}</span>
              </button>
            );
          })}
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
      <div className="p-4 border-t border-gray-200">
        <div className="relative">
          {/* Context Button - positioned in upper right */}
          <button
            onClick={handleAddContext}
            className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600 transition-colors z-10"
            title="Add context"
          >
            <PaperClipIcon className="w-4 h-4" />
          </button>
          
          <div className="flex space-x-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask about LaTeX..."
              className="flex-1 px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-black"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim()}
              className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <PaperAirplaneIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 