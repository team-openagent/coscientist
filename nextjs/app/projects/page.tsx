'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { IProject, ITeam } from '@/domain/model';
import { TrashIcon, ChevronDownIcon, CogIcon, ArrowRightOnRectangleIcon, ClockIcon, UserGroupIcon, PlusIcon } from '@heroicons/react/24/outline';
import { formatDate } from '@/lib/utils';


export default function ProjectsPage() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<IProject[]>([]);
  const [teams, setTeams] = useState<ITeam[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'recent' | ITeam>("recent");

  useEffect(() => {
    if (user) {
      try {
        setLoading(true);
        fetchProjects();
        fetchTeams();
      } finally {
        setLoading(false);
      }
    }
  }, [user]);


  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/project?query=recent');
      
      if (!response.ok) { 
        throw new Error('Failed to fetch projects'); }
      
      const data = await response.json();
      if (data.success) {
        setProjects(data.projects);
      } else {
        throw new Error(data.error || 'Failed to fetch projects');
      }
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const fetchTeams = async () => {
    try {
      const response = await fetch('/api/team');
      if (!response.ok) { 
        throw new Error('Failed to fetch teams'); 
      }
      const data = await response.json();
      setTeams(data.teams);
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleCreateProject = async (projectData: { name: string; team_id: string; }) => {
    try {
      const response = await fetch('/api/project', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
      });

      if (!response.ok) {
        throw new Error('Failed to create project');
      }

      const data = await response.json();
      if (data.success) {
        await fetchProjects();
        setShowCreateModal(false);
      } else {
        throw new Error(data.error || 'Failed to create project');
      }
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Please sign in to view projects</h1>
          <p className="text-gray-600">You need to be authenticated to access your projects.</p>
        </div>
      </div>
    );
  }


  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Panel */}
      <LeftPanel 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        teams={teams}
        setTeams={setTeams}
      />

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <p className="mt-2 text-gray-600">
                {activeTab === 'recent' ? 'Recent Projects' : `${activeTab.name}`}
              </p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Project
            </button>
          </div>
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No projects</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating your first project.</p>
            <div className="mt-6">
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create Project
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {projects.map((project) => (
              <ProjectCard key={project._id.toString()} project={project} onDelete={fetchProjects} />
            ))}
          </div>
        )}
        </div>
      </div>

      {/* Create Project Modal */}
      {!loading && showCreateModal && (
        <CreateProjectModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateProject}
          teams={teams}
        />
      )}
    </div>
  );
}
// LeftPanel component merged inline
interface LeftPanelProps {
  activeTab: 'recent' | ITeam;
  setActiveTab: (tab: 'recent' | ITeam) => void;
  teams: ITeam[];
  fetchTeams: () => void;
}

function LeftPanel({ activeTab, setActiveTab, teams, fetchTeams }: LeftPanelProps) {
  const { user, logout } = useAuth();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showAddTeamModal, setShowAddTeamModal] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');

  const handleLogout = async () => {
    await logout();
    window.location.href = '/login';
  };

  const handleAddTeam = async () => {
    const res = await fetch('/api/team', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: newTeamName.trim() }),
    });

    const data = await res.json();
    if (res.ok && data.team) {
      fetchTeams();
      setNewTeamName('');
      setShowAddTeamModal(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col">
      {/* User Profile Section */}
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <button
            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
              {user?.displayName ? getInitials(user.displayName) : 'U'}
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.displayName || 'User'}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user?.email || 'user@example.com'}
              </p>
            </div>
            <ChevronDownIcon 
              className={`w-4 h-4 text-gray-400 transition-transform ${
                showProfileDropdown ? 'rotate-180' : ''
              }`} 
            />
          </button>

          {/* Profile Dropdown */}
          {showProfileDropdown && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
              <div className="py-1">
                <button
                  onClick={() => {
                    setShowProfileDropdown(false);
                    window.location.href = '/settings';
                  }}
                  className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <CogIcon className="w-4 h-4 mr-3 text-gray-400" />
                  Settings
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <ArrowRightOnRectangleIcon className="w-4 h-4 mr-3 text-red-400" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <button
          onClick={() => setActiveTab('recent')}
          className={`w-full flex items-center space-x-3 px-4 py-2 text-sm font-medium transition-all duration-200 border-b border-gray-200 ${
            activeTab === 'recent'
              ? 'text-indigo-600 bg-indigo-50 border-r-4 border-indigo-600'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          }`}
        >
          <ClockIcon className={`w-5 h-5 ${
            activeTab === 'recent' ? 'text-indigo-600' : 'text-gray-400'
          }`} />
          <span>Recent</span>
        </button>

        {/* Teams Section */}
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center space-x-2">
            <UserGroupIcon className={`w-5 h-5 ${
              activeTab && typeof activeTab === 'object' 
                ? 'text-indigo-600' : 'text-gray-400'
            }`} />
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Teams</span>
          </div>
          <button
            onClick={() => setShowAddTeamModal(true)}
            className="p-1 rounded hover:bg-gray-100 transition"
            title="Add Team"
            type="button"
          >
            <PlusIcon className="w-4 h-4 text-gray-400" />
          </button>
        </div>
        {teams && teams.length > 0 && teams.map((team: ITeam) => (
          <button
            key={team._id.toString()}
            onClick={() => {
              setActiveTab(team);
            }}
            className={`w-full flex items-center space-x-3 px-4 py-1 text-sm font-medium transition-all duration-200 ${
              activeTab && typeof activeTab === 'object' && activeTab._id === team._id
                ? 'text-indigo-600 bg-indigo-50 border-r-4 border-indigo-600'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <span className="truncate">{team.name}</span>
          </button>
        ))}
      </div>

      {/* Spacer to push footer to the bottom */}
      <div className="flex-1" />

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="text-center">
          <p className="text-xs text-gray-500">
            AI Coscientist v1.0
          </p>
        </div>
      </div>

      {/* Add Team Modal */}
      {showAddTeamModal && (
        <div className="fixed inset-0 bg-black/30 text-black flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-sm w-full mx-4">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Create New Team</h3>
            </div>
            <div className="px-6 py-4">
              <div className="mb-4">
                <label htmlFor="teamName" className="block text-sm font-medium text-gray-700 mb-2">
                  Team Name
                </label>
                <input
                  type="text"
                  id="teamName"
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter team name"
                  maxLength={50}
                />
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowAddTeamModal(false)}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddTeam}
                  disabled={!newTeamName.trim()}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create Team
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}



// CreateProjectModal component merged inline
interface CreateProjectModalProps {
  onClose: () => void;
  onSubmit: (projectData: { name: string; team_id: string; }) => Promise<void>;
  teams: ITeam[];
}

function CreateProjectModal({ onClose, onSubmit, teams }: CreateProjectModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    team_id: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    console.log(teams)
    setFormData({
      name: '',
      team_id: teams[0]._id.toString(),
    });
  }, [teams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const newErrors: { [key: string]: string } = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Project name is required';
    }
    if (formData.name.trim().length > 100) {
      newErrors.name = 'Project name must be less than 100 characters';
    }
    if (!formData.team_id) {
      newErrors.team_id = 'Please select a team';
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      // Reset form
      setFormData({ name: '', team_id: '' });
    } catch (error) {
      console.error('Error creating project:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Create New Project</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-4">
          {/* Project Name */}
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Project Name *
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className={`w-full text-black px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 border-gray-300`}
              placeholder="Enter project name"
              maxLength={100}
            />
            <p className="mt-1 text-xs text-gray-500">
              {formData.name.length}/100 characters
            </p>
          </div>
          {/* Team Selection */}
          <div className="mb-4">
            <label htmlFor="team" className="block text-sm font-medium text-gray-700 mb-2">
              Team *
            </label>
            <select
              id="team"
              value={formData.team_id}
              onChange={(e) => handleInputChange('team_id', e.target.value)}
              className={`w-full text-black px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 border-gray-300`}
              required
            >
              {teams && teams.length > 0 ? (
                teams.map((team: ITeam) => (
                  <option key={team._id.toString()} value={team._id.toString()}>
                    {team.name}
                  </option>
                ))
              ) : (
                <option value="" disabled>No teams available</option>
              )}
            </select>
          </div>

          {/* Form Actions */}
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !formData.name.trim() || !formData.team_id}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Creating...
                </div>
              ) : (
                'Create Project'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}



function ProjectCard({ project, onDelete }: { project: IProject; onDelete: () => void }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      return;
    }
    setIsDeleting(true);
    await fetch(`/api/project/${project._id}`, { method: 'DELETE' });
    onDelete();
    setIsDeleting(false);
    setShowDeleteConfirm(false);
  };


  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
      {/* Project Thumbnail */}
      <div className="relative">
        <div className={`h-40 bg-blue-500 rounded-t-lg flex items-center justify-center`}
          onClick={() => window.location.href = `/projects/${project._id}`}
        >
          <svg className="w-10 h-10 bg-white rounded-full p-1 stroke-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
      </div>

      {/* Project Content */}
      <div className="p-3">
        {/* Project Name */}
        <h3 className="text-base font-semibold text-gray-900 line-clamp-2">
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
            className="text-black p-2 rounded-md text-sm"
            title="Delete Project"
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-sm w-full mx-4">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Delete Project</h3>
            </div>
            <div className="px-6 py-4">
              <p className="text-sm text-gray-600 mb-4">
                Are you sure you want to delete {project.name}? This action cannot be undone.
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

