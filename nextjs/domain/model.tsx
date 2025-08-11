// ============================================================================
// DOMAIN MODELS & INTERFACES
// ============================================================================

export interface Reference {
  reference_id: string; // UUID primary key
  project_id: string; // UUID foreign key
  type: 'pdf' | 'image';
  raw_data_path: string;
  uploader_id: string; // UUID foreign key
  created_at: Date;
}

export interface Block {
  block_id: string; // UUID primary key
  project_id: string; // UUID foreign key
  order: number;
  type: 'paragraph' | 'header' | 'image';
  data: Record<string, unknown>; // Editor.js JSON data
  created_at: Date;
}

export interface Topic {
  topic_id: string; // UUID primary key
  title: string;
  last_used_at: Date;
}

export interface ChatMessage {
  _id?: string; // MongoDB ObjectId as string
  session_id: string;
  type: 'human' | 'ai';
  content: string;
  created_at: Date;
  metadata?: {
    project_id?: string;
    user_id?: string;
    [key: string]: string | number | boolean | undefined;
  };
}

export interface Project {
  project_id: string; // UUID primary key
  name: string;
  created_at: Date;
  updated_at?: Date;
  description?: string;
  is_public?: boolean;
}

export interface User {
  user_id: string; // Firebase Auth UID
  display_name: string;
  email?: string;
  photo_url?: string;
  created_at: Date;
  updated_at?: Date;
  preferences?: {
    theme?: 'light' | 'dark';
    language?: string;
    [key: string]: string | number | boolean | undefined;
  };
}

export interface Team {
  user_id: string; // Firebase Auth UID
  project_id: string; // UUID foreign key
  role: 'owner' | 'admin' | 'member' | 'viewer';
  joined_at: Date;
  permissions?: {
    can_edit?: boolean;
    can_delete?: boolean;
    can_invite?: boolean;
    [key: string]: boolean | undefined;
  };
}

// ============================================================================
// MONGODB SCHEMAS
// ============================================================================

export const ReferenceSchema = {
  bsonType: 'object',
  required: ['reference_id', 'project_id', 'type', 'raw_data_path', 'uploader_id', 'created_at'],
  properties: {
    reference_id: {
      bsonType: 'string',
      pattern: '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
    },
    project_id: {
      bsonType: 'string',
      pattern: '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
    },
    type: {
      enum: ['pdf', 'image']
    },
    raw_data_path: {
      bsonType: 'string'
    },
    uploader_id: {
      bsonType: 'string',
      pattern: '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
    },
    created_at: {
      bsonType: 'date'
    }
  }
};

export const BlockSchema = {
  bsonType: 'object',
  required: ['block_id', 'project_id', 'order', 'type', 'data', 'created_at'],
  properties: {
    block_id: {
      bsonType: 'string',
      pattern: '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
    },
    project_id: {
      bsonType: 'string',
      pattern: '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
    },
    order: {
      bsonType: 'int',
      minimum: 0
    },
    type: {
      enum: ['paragraph', 'header', 'image']
    },
    data: {
      bsonType: 'object'
    },
    created_at: {
      bsonType: 'date'
    }
  }
};

export const TopicSchema = {
  bsonType: 'object',
  required: ['topic_id', 'title', 'last_used_at'],
  properties: {
    topic_id: {
      bsonType: 'string',
      pattern: '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
    },
    title: {
      bsonType: 'string',
      minLength: 1,
      maxLength: 200
    },
    last_used_at: {
      bsonType: 'date'
    }
  }
};

export const ChatMessageSchema = {
  bsonType: 'object',
  required: ['session_id', 'type', 'content', 'created_at'],
  properties: {
    session_id: {
      bsonType: 'string'
    },
    type: {
      enum: ['human', 'ai']
    },
    content: {
      bsonType: 'string',
      minLength: 1
    },
    created_at: {
      bsonType: 'date'
    },
    metadata: {
      bsonType: 'object',
      properties: {
        project_id: {
          bsonType: 'string',
          pattern: '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
        },
        user_id: {
          bsonType: 'string'
        }
      }
    }
  }
};

export const ProjectSchema = {
  bsonType: 'object',
  required: ['project_id', 'name', 'created_at'],
  properties: {
    project_id: {
      bsonType: 'string',
      pattern: '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
    },
    name: {
      bsonType: 'string',
      minLength: 1,
      maxLength: 100
    },
    created_at: {
      bsonType: 'date'
    },
    updated_at: {
      bsonType: 'date'
    },
    description: {
      bsonType: 'string',
      maxLength: 500
    },
    is_public: {
      bsonType: 'bool'
    }
  }
};

export const UserSchema = {
  bsonType: 'object',
  required: ['user_id', 'display_name', 'created_at'],
  properties: {
    user_id: {
      bsonType: 'string'
    },
    display_name: {
      bsonType: 'string',
      minLength: 1,
      maxLength: 100
    },
    email: {
      bsonType: 'string',
      pattern: '^[^@]+@[^@]+\\.[^@]+$'
    },
    photo_url: {
      bsonType: 'string'
    },
    created_at: {
      bsonType: 'date'
    },
    updated_at: {
      bsonType: 'date'
    },
    preferences: {
      bsonType: 'object',
      properties: {
        theme: {
          enum: ['light', 'dark']
        },
        language: {
          bsonType: 'string'
        }
      }
    }
  }
};

export const TeamSchema = {
  bsonType: 'object',
  required: ['user_id', 'project_id', 'role', 'joined_at'],
  properties: {
    user_id: {
      bsonType: 'string'
    },
    project_id: {
      bsonType: 'string',
      pattern: '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
    },
    role: {
      enum: ['owner', 'admin', 'member', 'viewer']
    },
    joined_at: {
      bsonType: 'date'
    },
    permissions: {
      bsonType: 'object',
      properties: {
        can_edit: {
          bsonType: 'bool'
        },
        can_delete: {
          bsonType: 'bool'
        },
        can_invite: {
          bsonType: 'bool'
        }
      }
    }
  }
};

// ============================================================================
// DATABASE COLLECTION NAMES
// ============================================================================

export const COLLECTIONS = {
  REFERENCES: 'references',
  BLOCKS: 'blocks',
  TOPICS: 'topics',
  CHAT_MESSAGES: 'chat_messages',
  PROJECTS: 'projects',
  USERS: 'users',
  TEAMS: 'teams'
} as const;

// ============================================================================
// UTILITY TYPES & HELPERS
// ============================================================================

export type CollectionName = typeof COLLECTIONS[keyof typeof COLLECTIONS];

export type ReferenceType = Reference['type'];
export type BlockType = Block['type'];
export type TeamRole = Team['role'];
export type ChatMessageType = ChatMessage['type'];

// Helper function to generate UUID
export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Helper function to create timestamps
export function createTimestamp(): Date {
  return new Date();
}

// Helper function to validate UUID format
export function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}
