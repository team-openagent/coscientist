import { NextRequest, NextResponse } from 'next/server';
import { Topic, User, Project } from '@/lib/model';
import { connectToDatabase } from '@/lib/mongodb';
import { getUID } from '@/lib/auth';
import { Types } from 'mongoose';


export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ project_id: string; topic_id: string }> }
) {
  try {
    const { project_id, topic_id } = await params;
    const uid = getUID(request);

    await connectToDatabase();
    const user = await User.findOne({ uid: uid });
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
    const deletedTopic = await Topic.findOneAndDelete({
      _id: topic_id,
      project_id: project_id
    });

    if (!deletedTopic) {
      return NextResponse.json(
        { error: 'Topic not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Topic deleted successfully' });
  } catch (error) {
    console.error('Error deleting topic:', error);
    return NextResponse.json(
      { error: 'Failed to delete topic' },
      { status: 500 }
    );
  }
}


// GET method to fetch chat history for a specific topic
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ project_id: string; topic_id: string }> }
) {
  try {
    const { project_id, topic_id } = await params;
    const uid = getUID(request);

    await connectToDatabase();
    const user = await User.findOne({ uid: uid });
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

    const messages = await Topic.findById(topic_id)
      .select('messages')
      .where('projectId').equals(project_id);

    return NextResponse.json(messages);
  } catch (error) {
    console.error('Error fetching chat history:', error);
    return NextResponse.json(
      { error: 'Failed to fetch chat history' },
      { status: 500 }
    );
  }
}

// PUT method to update topic name
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ project_id: string; topic_id: string }> }
) {
  try {
    const { project_id, topic_id } = await params;
    const uid = getUID(request);
    const { title } = await request.json();

    if (!title) {
      return NextResponse.json(
        { success: false, error: 'Topic name is required' },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const user = await User.findOne({ uid: uid });
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

    const updatedTopic = await Topic.findOneAndUpdate(
      {_id: topic_id},
      { title: title },
      { new: true }
    );

    return NextResponse.json(updatedTopic);
  } catch (error) {
    console.error('Error updating topic:', error);
    return NextResponse.json(
      { error: 'Failed to update topic' },
      { status: 500 }
    );
  }
}

