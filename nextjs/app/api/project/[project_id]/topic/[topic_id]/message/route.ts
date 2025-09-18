import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongo/connection';
import { getUID } from '@/lib/auth';
import { User, Project, IUser, IProject, ITeam, IMessageHistory, MessageHistory } from '@/lib/mongo/model';
import { Types } from 'mongoose';
import { MongoDBCheckpointer } from '@/lib/mongo/connection';
import { CheckpointTuple } from '@langchain/langgraph-checkpoint';

// Define types for message data
interface MessageData {
  id?: string;
  metadata?: {
    timestamp?: number;
    content?: string;
    type?: string;
    sender?: string;
  };
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ project_id: string; topic_id: string }> }
) {
  const { project_id, topic_id } = await params;
  const uid = getUID(request);
  
  const client = (await connectToDatabase()).connection.getClient();
  
  // Get user and project information
  const user: IUser | null = await User.findOne({ uid: uid });
  if (!user) {
    return NextResponse.json(
      { success: false, error: 'User not found' },
      { status: 404 }
    );
  }
  
  const project = await Project.findOne({ _id: project_id }).populate('team');
  if (!project) {
    return NextResponse.json(
      { success: false, error: 'Project not found' },
      { status: 404 }
    );
  }
  
  // Check if user is a member of the project's team
  const team = project.team;
  const isTeamMember = (team.users as Types.ObjectId[]).includes(user._id);
  if (!isTeamMember) {
    return NextResponse.json(
      { success: false, error: 'User does not have permission to access this project' },
      { status: 403 }
    );
  }

  // Get MongoDB client for checkpointer
  const checkpointer = new MongoDBCheckpointer({
    client: client
  });

  const messageHistory = await MessageHistory.find({ topic_id: topic_id });
  const checkpointIds = messageHistory.map((msg) => msg.checkpoint_id);
  // Get message history from checkpointer using topic_id
  const checkpoints = await checkpointer.listByCheckpointId(
    {
      configurable: {
        thread_id: topic_id,
      },
    },
    checkpointIds
  );

  const messagesArray: CheckpointTuple[] = [];
  for await (const msg of checkpoints) {
    messagesArray.push(msg);
  }

  const sortedMessages = messagesArray.sort((a: CheckpointTuple, b: CheckpointTuple) => {
    const dateA = new Date(a.checkpoint.ts);
    const dateB = new Date(b.checkpoint.ts);
    return dateB.getTime() - dateA.getTime();
  });

  // Format the response
  const formattedMessages = sortedMessages.map((msg: CheckpointTuple) => ({
    id: msg.checkpoint.id,
    timestamp: msg.checkpoint.ts,
    input_query: msg.checkpoint.channel_values.input_query,
    reasoning: msg.checkpoint.channel_values.reasonings,
  }));

  return NextResponse.json({
    messages: formattedMessages,
    total: formattedMessages.length
  });
}
