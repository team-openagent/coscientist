import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import { COLLECTIONS } from '@/domain/model';
import { ObjectId } from 'mongodb';

export async function GET(request: NextRequest) {
  try {
    const user = getAuthenticatedUser(request);
    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db;
    
    if (!db) {
      throw new Error('Database connection failed');
    }
    
    // Get user's teams
    const userTeams = await db.collection(COLLECTIONS.TEAMS).find({
      'users': user.uid
    }).toArray();
    
    // Get projects from user's teams
    const teamIds = userTeams.map((team: any) => team._id);
    const projects = await db.collection(COLLECTIONS.PROJECTS).find({
      'team': { $in: teamIds }
    }).toArray();
    
    return NextResponse.json({
      success: true,
      data: {
        projects: projects.map((project: any) => ({
          _id: project._id,
          name: project.name,
          description: project.description,
          created_at: project.created_at,
          updated_at: project.updated_at,
          is_public: project.is_public,
          team: project.team
        }))
      }
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = getAuthenticatedUser(request);
    const { name, description, is_public } = await request.json();
    
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Project name is required' },
        { status: 400 }
      );
    }
    
    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db;
    
    if (!db) {
      throw new Error('Database connection failed');
    }
    
    // Get or create personal team for the user
    let personalTeam = await db.collection(COLLECTIONS.TEAMS).findOne({
      'users': user.uid,
      'permissions.is_personal': true
    });
    
    if (!personalTeam) {
      personalTeam = {
        _id: new ObjectId(),
        name: 'Personal',
        users: [user.uid],
        created_at: new Date(),
        permissions: {
          is_personal: true,
          can_edit: true,
          can_invite: false
        }
      };
      await db.collection(COLLECTIONS.TEAMS).insertOne(personalTeam);
    }
    
    // Create new project
    const newProject = {
      _id: new ObjectId(),
      name: name.trim(),
      description: description?.trim() || '',
      team: personalTeam._id,
      created_at: new Date(),
      updated_at: new Date(),
      is_public: is_public || false
    };
    
    await db.collection(COLLECTIONS.PROJECTS).insertOne(newProject);
    
    // Update team with new project - using $addToSet to avoid duplicates
    await db.collection(COLLECTIONS.TEAMS).updateOne(
      { _id: personalTeam._id },
      { $addToSet: { project_ids: newProject._id.toString() } }
    );
    
    return NextResponse.json({
      success: true,
      data: {
        project: {
          _id: newProject._id,
          name: newProject.name,
          description: newProject.description,
          created_at: newProject.created_at,
          updated_at: newProject.updated_at,
          is_public: newProject.is_public,
          team: newProject.team
        }
      }
    });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create project' },
      { status: 500 }
    );
  }
}
