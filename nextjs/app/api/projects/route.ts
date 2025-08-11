import { NextRequest, NextResponse } from 'next/server';
import { ProjectRepository } from '@/lib/repositories/projectRepository';
import { generateUUID, createTimestamp } from '@/domain/model';

const projectRepo = new ProjectRepository();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const isPublic = searchParams.get('public');
    
    let projects;
    if (isPublic === 'true') {
      projects = await projectRepo.findPublicProjects();
    } else {
      projects = await projectRepo.find({});
    }
    
    return NextResponse.json({ projects });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, isPublic = false } = body;
    
    if (!name) {
      return NextResponse.json(
        { error: 'Project name is required' },
        { status: 400 }
      );
    }
    
    const project = {
      project_id: generateUUID(),
      name,
      description,
      is_public: isPublic,
      created_at: createTimestamp()
    };
    
    const createdProject = await projectRepo.create(project);
    
    return NextResponse.json(
      { project: createdProject },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
}
