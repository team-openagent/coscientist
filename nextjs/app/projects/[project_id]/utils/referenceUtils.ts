import { LinkIcon, PhotoIcon, DocumentIcon } from '@heroicons/react/24/outline';
import { Reference } from '../editor';
import React from 'react';

export const getTypeIcon = (type: Reference['type']) => {
  switch (type) {
    case 'weblink':
      return React.createElement(LinkIcon, { className: "w-4 h-4 text-blue-500" });
    case 'figure':
      return React.createElement(PhotoIcon, { className: "w-4 h-4 text-green-500" });
    case 'pdf':
      return React.createElement(DocumentIcon, { className: "w-4 h-4 text-red-500" });
  }
};

export const getTypeLabel = (type: Reference['type']) => {
  switch (type) {
    case 'weblink':
      return 'Web Link';
    case 'figure':
      return 'Figure';
    case 'pdf':
      return 'PDF';
  }
}; 