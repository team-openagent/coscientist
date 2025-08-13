'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ChevronDownIcon, CogIcon, ArrowRightOnRectangleIcon, ClockIcon, UserGroupIcon, PlusIcon } from '@heroicons/react/24/outline';
import { IProject, ITeam } from '@/domain/model';

// Local interface for team display (not the full ITeam from database)
interface LocalTeam {
  _id: string;
  name: string;
  users: string[];
  created_at: Date;
  permissions: {
    is_personal: boolean;
    can_edit: boolean;
    can_invite: boolean;
  }
}

export default function LeftPanel({ activeTab, setActiveTab }: { activeTab: 'recent' | LocalTeam, setActiveTab: (tab: 'recent' | LocalTeam) => void }) {
  const { user, logout } = useAuth();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [teams, setTeams] = useState<LocalTeam[]>([]);
  const [recentProjects, setRecentProjects] = useState<IProject[]>([]);
  const [showAddTeamModal, setShowAddTeamModal] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');

  useEffect(() => {
    // Initialize default personal team
    const personalTeam: LocalTeam = {
      _id: 'personal',
      name: 'Personal',
      users: [],
      created_at: new Date(),
      permissions: {
        is_personal: true,
        can_edit: true,
        can_invite: false
      }
    };
    setTeams([personalTeam]);
    fetchRecentProjects();
  }, [user]);

  const fetchRecentProjects = async () => {
    try {
      const response = await fetch('/api/project/list');
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Sort projects by last edited date (most recent first)
          const sortedProjects = data.data.projects.sort((a: IProject, b: IProject) => {
            const dateA = new Date(b.updated_at || b.created_at);
            const dateB = new Date(a.updated_at || a.created_at);
            return dateA.getTime() - dateB.getTime();
          });
          setRecentProjects(sortedProjects.slice(0, 10)); // Show top 10 most recent
        }
      }
    } catch (error) {
      console.error('Error fetching recent projects:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleProjectClick = (projectId: string) => {
    window.location.href = `/editor?project=${projectId}`;
  };

  const handleAddTeam = () => {
    if (newTeamName.trim()) {
      const newTeam: LocalTeam = {
        _id: Date.now().toString(),
        name: newTeamName.trim(),
        users: [],
        created_at: new Date(),
        permissions: {
          is_personal: false,
          can_edit: true,
          can_invite: true
        }
      };
      setTeams([...teams, newTeam]);
      setNewTeamName('');
      setShowAddTeamModal(false);
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatProjectDate = (dateString: string | Date) => {
    try {
      const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
      return formatTimeAgo(date);
    } catch {
      return 'Unknown date';
    }
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
        {teams && teams.length > 0 && teams.map((team: LocalTeam) => (
          <button
            key={team._id}
            onClick={() => setActiveTab(team)}
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
        <div className="fixed inset-0 bg-black/30  flex items-center justify-center z-50">
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
