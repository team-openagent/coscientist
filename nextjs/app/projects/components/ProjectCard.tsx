'use client';

import React, { useState } from 'react';
import { IProject } from '@/domain/model';
import { formatDistanceToNow } from 'date-fns';
import { TrashIcon } from '@heroicons/react/24/outline';

interface ProjectCardProps {
  project: IProject;
  onUpdate: () => void;
}

export default function ProjectCard({ project, onUpdate }: ProjectCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/project/${project._id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        onUpdate();
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to delete project');
      }
    } catch (error) {
      alert('An error occurred while deleting the project');
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const formatDate = (dateString: string | Date) => {
    try {
      const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
      return formatDistanceToNow(date, { addSuffix: true });
    } catch {
      return 'Unknown date';
    }
  };

  const getThumbnailColor = (projectId: string) => {
    // Generate a consistent color based on project ID
    const colors = [
      'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-pink-500',
      'bg-indigo-500', 'bg-yellow-500', 'bg-red-500', 'bg-teal-500'
    ];
    const index = projectId.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
      {/* Project Thumbnail */}
      <div className="relative">
        <div className={`h-40 ${getThumbnailColor("0")} rounded-t-lg flex items-center justify-center`}
            onClick={() => window.location.href = `/editor?project=${project._id}`}
        >
          <svg className="w-10 h-10 bg-white rounded-full p-1 stroke-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
      </div>

      {/* Project Content */}
      <div className="p-3">
        {/* Project Name */}
        <h3 className="text-base font-semibold text-gray-900 mb-2 line-clamp-2">
          {project.name}
        </h3>
        
        <div className="flex space-x-2 justify-between">
          {/* Project Metadata */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Edited {formatDate(project.updated_at)}</span>
          </div> 
          {/* Action Buttons */}
          <button
            onClick={() => setShowDeleteConfirm(true)}
            disabled={isDeleting}
            className="text-black p-2 rounded-md text-sm"
            title="Delete Project"
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-sm w-full mx-4">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Delete Project</h3>
            </div>
            <div className="px-6 py-4">
              <p className="text-sm text-gray-600 mb-4">
                Are you sure you want to delete "{project.name}"? This action cannot be undone.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
