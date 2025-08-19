import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IProject extends Document{
  _id: Types.ObjectId; 
  team: Types.ObjectId; // UUID foreign key
  name: string;
  created_at: Date;
  updated_at: Date;
}

const projectSchema: Schema = new Schema({
  _id: { type: Schema.Types.ObjectId, auto: true },
  team: { type: Schema.Types.ObjectId, ref: 'Team', required: true },
  name: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});


export const Project = mongoose.models.Project || mongoose.model<IProject>('Project', projectSchema);


export interface IUser extends Document {
  _id: Types.ObjectId;
  uid: string; // Firebase Auth UID
  teams: Types.ObjectId[]; // Array of team IDs
  email: string;
  display_name?: string;
  photo_url?: string;
  created_at: Date;
  //preferences?: {
  //  theme?: 'light' | 'dark';
  //  language?: string;
  //  [key: string]: string | number | boolean | undefined;
  //};
}

const userSchema: Schema = new Schema({
  _id: { type: Schema.Types.ObjectId, auto: true },
  uid: { type: String, required: true, unique: true },
  teams: { type: [Schema.Types.ObjectId], ref: 'Team', required: true },
  email: { type: String, required: true },
  display_name: { type: String, required: false },
  photo_url: { type: String, required: false, default: "data:image/webp;base64,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" },
  created_at: { type: Date, default: Date.now },
});


export const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema);


export interface ITeam extends Document {
  _id: Types.ObjectId;
  users: Types.ObjectId[];
  name: string,
  created_at: Date;
  permissions: {
    is_personal: boolean;
    can_edit: boolean;
    can_invite: boolean;
  }
}

const teamSchema: Schema = new Schema({
  _id: { type: Schema.Types.ObjectId, auto: true },
  users: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
  name: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  permissions: {
    is_personal: { type: Boolean, default: false },
    can_edit: { type: Boolean, default: true },
    can_invite: { type: Boolean, default: false }
  }
});


export const Team = mongoose.models.Team || mongoose.model<ITeam>('Team', teamSchema);


export interface IReference extends Document{
  _id: Types.ObjectId;
  title: string;
  project: Types.ObjectId;
  uploader: Types.ObjectId; 
  type: 'pdf' | 'image';
  raw_data_path?: string;
  created_at: Date;
  summary?: string;
}

const referenceSchema: Schema = new Schema({
  _id: { type: Schema.Types.ObjectId, auto: true },
  title: { type: String, reuquired: true},
  project: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
  uploader: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['pdf', 'image'], required: true },
  raw_data_path: { type: String, required: false },
  created_at: { type: Date, default: Date.now },
  summary: { type: String, required: false }
})


export const Reference = mongoose.models.Reference || mongoose.model<IReference>('Reference', referenceSchema);


//const blockType = ['paragraph', 'header', 'image'];
export interface IPaper {
  project_id: string; // UUID foreign key
  time: string;
  blocks: Array<{
    id: string;
    type: string;
    data: Record<string, unknown>;
  }>;
}

const paperSchema: Schema = new Schema({
  _id: { type: Schema.Types.ObjectId, auto: true },
  project_id: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
  time: { type: String, required: true },
  blocks: { type: Array, required: true, default: [] },
})

export const Paper = mongoose.models.Paper || mongoose.model<IPaper>('Paper', paperSchema);


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
