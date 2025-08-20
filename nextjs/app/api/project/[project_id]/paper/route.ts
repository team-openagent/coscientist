import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { getUID } from '@/lib/auth';
import { Paper, IPaper, User, Project, IProject, ITeam, IUser } from '@/domain/model';
import { Types } from 'mongoose';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ project_id: string }> }
) {
    const { project_id } = await params;
    const uid = getUID(request);
    const body = await request.json();

    await connectToDatabase();
    
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

    // Create new paper
    const newPaper = new Paper({
      project_id: project_id,
      time: Date.now().toString(),
      blocks: body?.blocks || []
    });
    const savedPaper = await newPaper.save();
    return NextResponse.json({ paper: savedPaper });
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ project_id: string }> }
) {
  const { project_id } = await params;
  const uid = getUID(request);
  
  await connectToDatabase();
  
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
      { error: 'User does not have permission to access this project' },
      { status: 403 }
    );
  }
  
  // Get the paper for the project
  // find the latest one
  let paper = await Paper.findOne({ project_id: project_id }).sort({ time: -1 });
  if (!paper) {
    const newPaper = new Paper({
      project_id: project_id,
      time: Date.now().toString(),
      blocks: []
    });
    paper = await newPaper.save();
  }

  return NextResponse.json({ paper: paper });
}
