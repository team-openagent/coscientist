# Workspace Context System

The Workspace Context system provides simple state management for the user's current workspace, specifically tracking the current `team_id` and `project_id`.

## Overview

The system is designed to be lightweight and focused:
- **WorkspaceContext** - Simple context that stores current team and project IDs
- **useWorkspace** - Hook to access the workspace context
- **No complex operations** - Just state storage and basic setters

## Features

### State Management
- **Current Team ID**: Tracks the active team ID
- **Current Project ID**: Tracks the active project ID
- **Simple Setters**: Easy functions to update workspace state
- **No API calls** - Pure state management

### What It Does NOT Do
- ❌ Create/update/delete teams or projects
- ❌ Fetch data from APIs
- ❌ Handle permissions or user management
- ❌ Manage complex workspace operations

## Usage

### Basic Setup

Wrap your app with the WorkspaceProvider:

```tsx
// app/layout.tsx
import { WorkspaceProvider } from '../contexts/WorkspaceContext';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <WorkspaceProvider>
          {children}
        </WorkspaceProvider>
      </body>
    </html>
  );
}
```

### Using the Workspace Context

```tsx
import { useWorkspace } from '../contexts/WorkspaceContext';

function MyComponent() {
  const { currentTeamId, currentProjectId, setCurrentTeam, setCurrentProject } = useWorkspace();

  const handleTeamChange = (teamId: string) => {
    setCurrentTeam(teamId);
  };

  const handleProjectChange = (projectId: string) => {
    setCurrentProject(projectId);
  };

  return (
    <div>
      <p>Current Team: {currentTeamId || 'None'}</p>
      <p>Current Project: {currentProjectId || 'None'}</p>
      
      <button onClick={() => handleTeamChange('team-123')}>
        Switch to Team 123
      </button>
      
      <button onClick={() => handleProjectChange('project-456')}>
        Switch to Project 456
      </button>
    </div>
  );
}
```

### Setting Both at Once

```tsx
const { setWorkspace, clearWorkspace } = useWorkspace();

// Set both team and project
setWorkspace('team-123', 'project-456');

// Clear both
clearWorkspace();
```

## API Reference

### State Properties
- `currentTeamId: string | null` - Current team ID
- `currentProjectId: string | null` - Current project ID

### Methods
- `setCurrentTeam(teamId: string | null)` - Set current team ID
- `setCurrentProject(projectId: string | null)` - Set current project ID
- `setWorkspace(teamId: string | null, projectId: string | null)` - Set both at once
- `clearWorkspace()` - Clear both IDs

## Example: Workspace Status Component

```tsx
import { useWorkspace } from '../contexts/WorkspaceContext';

function WorkspaceStatus() {
  const { currentTeamId, currentProjectId, setCurrentTeam, setCurrentProject } = useWorkspace();

  return (
    <div className="workspace-status">
      <h3>Current Workspace</h3>
      
      <div className="status-item">
        <label>Team ID:</label>
        <span className={currentTeamId ? 'active' : 'inactive'}>
          {currentTeamId || 'Not set'}
        </span>
        <button onClick={() => setCurrentTeam('new-team-id')}>
          Change Team
        </button>
      </div>
      
      <div className="status-item">
        <label>Project ID:</label>
        <span className={currentProjectId ? 'active' : 'inactive'}>
          {currentProjectId || 'Not set'}
        </span>
        <button onClick={() => setCurrentProject('new-project-id')}>
          Change Project
        </button>
      </div>
    </div>
  );
}
```

## Integration with Existing Components

The simplified WorkspaceContext integrates with existing components:

- **AddPanel**: Shows current workspace IDs from context
- **Navigation**: Can display current workspace status
- **Any Component**: Can access current team/project IDs

## When to Use

Use this context when you need to:
- ✅ Track which team/project the user is currently working with
- ✅ Share workspace state across components
- ✅ Provide simple workspace switching functionality
- ✅ Store workspace context without complex business logic

Don't use this context when you need:
- ❌ Complex team/project management
- ❌ API integration for CRUD operations
- ❌ Permission checking
- ❌ User management features

## Best Practices

1. **Keep it simple** - Only store what you need
2. **Use for display** - Show current workspace status
3. **Simple state updates** - Use setters to change workspace
4. **No business logic** - Handle complex operations elsewhere
5. **Component integration** - Use in components that need workspace awareness

This provides a lightweight and maintainable way to track workspace state throughout the application.
