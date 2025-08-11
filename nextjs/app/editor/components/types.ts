import { Reference } from '../editor';

export interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  contextReferences?: Reference[];
}

export interface Topic {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
} 