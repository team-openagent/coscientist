import { useWorkspace } from '../contexts/WorkspaceContext';

/**
 * Custom hook for simplified workspace management
 * Provides common workspace operations with better error handling
 */
export const useWorkspaceManager = () => {
  const workspace = useWorkspace();

  /**
   * Switch to a specific team and optionally a project
   */
  const switchToTeam = (teamId: string, projectId?: string) => {
    try {
      workspace.switchWorkspace(teamId, projectId);
      return { success: true };
    } catch (error) {
      console.error('Failed to switch team:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  };

  /**
   * Switch to a specific project within the current team
   */
  const switchToProject = (projectId: string) => {
    if (!workspace.currentTeamId) {
      return { success: false, error: 'No team selected' };
    }
    
    try {
      workspace.switchWorkspace(workspace.currentTeamId, projectId);
      return { success: true };
    } catch (error) {
      console.error('Failed to switch project:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  };

  /**
   * Create a new team and switch to it
   */
  const createAndSwitchToTeam = async (teamData: { name: string; isPersonal?: boolean }) => {
    try {
      const newTeam = await workspace.createTeam({
        name: teamData.name,
        permissions: {
          is_personal: teamData.isPersonal || false,
          can_edit: true,
          can_invite: false,
        },
      });

      if (newTeam) {
        workspace.switchWorkspace(newTeam._id);
        return { success: true, team: newTeam };
      } else {
        return { success: false, error: 'Failed to create team' };
      }
    } catch (error) {
      console.error('Failed to create team:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  };

  /**
   * Create a new project in the current team
   */
  const createProjectInCurrentTeam = async (projectData: { name: string }) => {
    if (!workspace.currentTeamId) {
      return { success: false, error: 'No team selected' };
    }

    try {
      const newProject = await workspace.createProject({
        name: projectData.name,
        team: workspace.currentTeamId,
      });

      if (newProject) {
        workspace.switchWorkspace(workspace.currentTeamId, newProject._id);
        return { success: true, project: newProject };
      } else {
        return { success: false, error: 'Failed to create project' };
      }
    } catch (error) {
      console.error('Failed to create project:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  };

  /**
   * Check if user can perform a specific action
   */
  const canPerformAction = (action: 'create' | 'edit' | 'delete' | 'invite') => {
    if (!workspace.currentTeam) return false;

    switch (action) {
      case 'create':
      case 'edit':
        return workspace.hasPermission('can_edit') || workspace.hasPermission('is_personal');
      case 'delete':
        return workspace.hasPermission('can_edit');
      case 'invite':
        return workspace.hasPermission('can_invite');
      default:
        return false;
    }
  };

  /**
   * Get current workspace summary
   */
  const getWorkspaceSummary = () => {
    return {
      team: workspace.currentTeam ? {
        id: workspace.currentTeam._id,
        name: workspace.currentTeam.name,
        permissions: workspace.currentTeam.permissions,
      } : null,
      project: workspace.currentProject ? {
        id: workspace.currentProject._id,
        name: workspace.currentProject.name,
      } : null,
      canEdit: canPerformAction('edit'),
      canCreate: canPerformAction('create'),
      canDelete: canPerformAction('delete'),
      canInvite: canPerformAction('invite'),
    };
  };

  /**
   * Refresh current workspace data
   */
  const refreshCurrentWorkspace = async () => {
    try {
      await workspace.refreshWorkspace();
      return { success: true };
    } catch (error) {
      console.error('Failed to refresh workspace:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  };

  return {
    // Current state
    currentTeam: workspace.currentTeam,
    currentProject: workspace.currentProject,
    currentTeamId: workspace.currentTeamId,
    currentProjectId: workspace.currentProjectId,
    isLoading: workspace.isLoading,
    error: workspace.error,
    
    // Actions
    switchToTeam,
    switchToProject,
    createAndSwitchToTeam,
    createProjectInCurrentTeam,
    refreshCurrentWorkspace,
    
    // Permissions
    canPerformAction,
    hasPermission: workspace.hasPermission,
    
    // Utilities
    getWorkspaceSummary,
    getTeamById: workspace.getTeamById,
    getProjectById: workspace.getProjectById,
    
    // Direct access to workspace context methods
    workspace,
  };
};
