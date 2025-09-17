import { NextRequest, NextResponse } from 'next/server';
import { Topic, ITopic, User, IUser, Project, IProject } from '@/lib/model';
import { connectToDatabase } from '@/lib/mongodb';
import { getUID } from '@/lib/auth';
import { Types } from 'mongoose';

// GET method to fetch all topics for a project
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ project_id: string }> }
) {
  const { project_id } = await params;
  const uid = getUID(request);

  await connectToDatabase();
  const user: IUser | null = await User.findOne({uid: uid});
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

  const topics = await Topic.find({ project_id: project_id })
    .sort({ createdAt: -1 });

  return NextResponse.json(topics);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ project_id: string }> }
) {
  const { project_id } = await params;
  const { title } = await request.json();
  const uid = getUID(request);

  await connectToDatabase();

  const user: IUser | null = await User.findOne({uid: uid});
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

  const newTopic = new Topic({
    project_id: project_id,
    title: title,
  });

  const savedTopic = await newTopic.save();
  return NextResponse.json(savedTopic);
}
