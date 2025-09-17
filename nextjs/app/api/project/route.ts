import { NextRequest, NextResponse } from 'next/server';
import { getUID } from '@/lib/auth';
import { Project, IProject, Team, ITeam, User, IUser} from '@/lib/model';


export async function GET(request: NextRequest) {
  const uid = getUID(request);

  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');
  if (query === 'recent') {
    const user: IUser | null = await User.findOne({ uid: uid });
    const teamIds = user?.teams || [];
    const projects: IProject[] = await Project.find({ team: { $in: teamIds } });
    
    return NextResponse.json({
      projects: projects,
      success: true,
    });
  }
  return NextResponse.json({
    error: 'Invalid query',
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const uid = getUID(request);

    // Find user
    const user: IUser | null = await User.findOne({ uid: uid });
    if (!user?.teams || !user.teams.map(t => t.toString()).includes(body.team_id.toString())) {
      return NextResponse.json(
        { error: 'You are not a member of the selected team' },
        { status: 403 }
      );
    }

    const project = new Project({
      name: body.name,
      team: body.team_id,
    });
    await project.save();
    return NextResponse.json({
      project: project,
      success: true,
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'User not authenticated') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
