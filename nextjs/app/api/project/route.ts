import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth';
import { Project, IProject} from '@/domain/model';

//export async function GET(request: NextRequest) {
//  try {
//    const projects: IProject[] = await Project.find();
//    return NextResponse.json(projects);
//  } catch (error) {
//    return NextResponse.json({ message: 'Error fetching projects', error }, { status: 500 });
//  }
//});

export async function GET(request: NextRequest) {
  const user = getAuthenticatedUser(request);

  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');
  if (query === 'list') {
    return NextResponse.json({
      user: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
      },
      projects: [
        {
          id: 'project1',
          name: 'Project One',
        },
        {
          id: 'project2',
          name: 'Project Two',
        },
      ],
    });
  }
  return NextResponse.json({
    error: 'Invalid query',
  });
}

export async function POST(request: NextRequest) {
  try {
    // Get authenticated user information
    const user = getAuthenticatedUser(request);
    
    const body = await request.json();
    // Your protected API logic here
    return NextResponse.json({
      message: 'Project created successfully',
      user: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
      },
      data: body,
      timestamp: new Date().toISOString(),
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
