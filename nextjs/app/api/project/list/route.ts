import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth-utils';
import { getDb } from '@/lib/mongodb';
import { COLLECTIONS, Project, Team, generateUUID, createTimestamp } from '@/domain/model';
import { ObjectId } from 'mongodb';

export async function GET(request: NextRequest) {
  try {
    // Get authenticated user information
    const user = getAuthenticatedUser(request);
    
    // Get query parameters for filtering and pagination
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    
    const db = await getDb();
    const projectsCollection = db.collection(COLLECTIONS.PROJECTS);
    const teamsCollection = db.collection(COLLECTIONS.TEAMS);
    
    // Build aggregation pipeline to get projects with team information
    const pipeline: any[] = [
      // Match projects that the user has access to
      {
        $lookup: {
          from: COLLECTIONS.TEAMS,
          localField: 'project_id',
          foreignField: 'project_id',
          as: 'team'
        }
      },
      {
        $match: {
          'team.user_id': user.uid
        }
      },
      // Unwind the team array
      {
        $unwind: '$team'
      },
      // Add computed fields
      {
        $addFields: {
          userRole: '$team.role',
          userPermissions: '$team.permissions'
        }
      },
      // Remove the team field from the result
      {
        $project: {
          team: 0
        }
      }
    ];
    
    // Add search filter if provided
    if (search) {
      pipeline.unshift({
        $match: {
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } }
          ]
        }
      });
    }
    
    // Add status filter if provided
    if (status) {
      pipeline.unshift({
        $match: {
          status: status
        }
      });
    }
    
    // Get total count for pagination
    const countPipeline = [...pipeline, { $count: 'total' }];
    const countResult = await projectsCollection.aggregate(countPipeline).toArray();
    const totalProjects = countResult.length > 0 ? countResult[0].total : 0;
    
    // Add pagination
    pipeline.push(
      { $skip: (page - 1) * limit },
      { $limit: limit },
      { $sort: { created_at: -1 } }
    );
    
    // Execute the aggregation
    const projects = await projectsCollection.aggregate(pipeline).toArray();
    
    // Calculate pagination metadata
    const totalPages = Math.ceil(totalProjects / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;
    
    return NextResponse.json({
      success: true,
      data: {
        projects: projects.map(project => ({
          ...project,
          created_at: project.created_at?.toISOString(),
          updated_at: project.updated_at?.toISOString()
        })),
        pagination: {
          currentPage: page,
          totalPages,
          totalProjects,
          hasNextPage,
          hasPreviousPage,
          limit,
        },
        filters: {
          status,
          search,
        },
      },
      user: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
      },
      timestamp: new Date().toISOString(),
    });
    
  } catch (error) {
    if (error instanceof Error && error.message === 'User not authenticated') {
      return NextResponse.json(
        { 
          success: false,
          error: 'Authentication required' 
        },
        { status: 401 }
      );
    }
    
    console.error('Error fetching project list:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error' 
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get authenticated user information
    const user = getAuthenticatedUser(request);
    
    // Parse request body
    const body = await request.json();
    const { name, description, is_public = false } = body;
    
    // Validate required fields
    if (!name) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Project name is required' 
        },
        { status: 400 }
      );
    }
    
    const db = await getDb();
    const projectsCollection = db.collection(COLLECTIONS.PROJECTS);
    const teamsCollection = db.collection(COLLECTIONS.TEAMS);
    
    // Generate new project ID
    const projectId = generateUUID();
    const now = createTimestamp();
    
    // Create new project
    const newProject: Project = {
      project_id: projectId,
      name,
      description,
      is_public,
      created_at: now,
      updated_at: now,
    };
    
    // Insert the project
    await projectsCollection.insertOne(newProject);
    
    // Create team entry with user as owner
    const teamEntry: Team = {
      user_id: user.uid,
      project_id: projectId,
      role: 'owner',
      joined_at: now,
      permissions: {
        can_edit: true,
        can_delete: true,
        can_invite: true,
      },
    };
    
    await teamsCollection.insertOne(teamEntry);
    
    return NextResponse.json({
      success: true,
      message: 'Project created successfully',
              data: {
          ...newProject,
          created_at: newProject.created_at.toISOString(),
          updated_at: newProject.updated_at?.toISOString() || newProject.created_at.toISOString(),
          userRole: 'owner',
          userPermissions: teamEntry.permissions,
        },
      user: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
      },
      timestamp: new Date().toISOString(),
    }, { status: 201 });
    
  } catch (error) {
    if (error instanceof Error && error.message === 'User not authenticated') {
      return NextResponse.json(
        { 
          success: false,
          error: 'Authentication required' 
        },
        { status: 401 }
      );
    }
    
    console.error('Error creating project:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error' 
      },
      { status: 500 }
    );
  }
}
