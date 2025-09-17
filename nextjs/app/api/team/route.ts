import { NextRequest, NextResponse } from 'next/server';
import { getUID } from '@/lib/auth';
import { Team, ITeam, User, IUser } from '@/lib/model';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET(request: NextRequest) {
  console.log("GET request");
  const uid = getUID(request);
  console.log("UID: ", uid);
  // Find user and get their teams
  const user: IUser | null = await User.findOne({ uid: uid });
  if (!user) {
    return NextResponse.json(
      { error: 'User not found' },
      { status: 404 }
    );
  }

  // Get all teams the user is a member of
  const teams: ITeam[] = await Team.find({ 
    _id: { $in: user.teams } 
  });

  return NextResponse.json({
    teams: teams,
  });
}

export async function POST(request: NextRequest) {
  try {
    const uid = getUID(request);
    const body = await request.json();

    // Validate required fields
    if (!body.name || typeof body.name !== 'string' || body.name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Team name is required' },
        { status: 400 }
      );
    }

    // Find user
    await connectToDatabase();
    const user: IUser | null = await User.findOne({ uid: uid });
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Create new team
    const team = new Team({
      name: body.name.trim(),
      users: [user._id], // Add the creator as the first user
      permissions: {
        is_personal: false,
        can_edit: true,
        can_invite: true
      }
    });

    await team.save();
    user.teams.push(team._id);
    await user.save();

    return NextResponse.json({
      team: team,
    });
    
  } catch (error) {
    if (error instanceof Error && error.message === 'User not authenticated') {
      return NextResponse.json(
        { error: 'Authentication required', redirect: '/login' },
        { 
          status: 401,
          headers: {
            'X-Redirect': '/login'
          }
        }
      );
    }
    
    console.error('Error creating team:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
