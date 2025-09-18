import { NextRequest } from 'next/server';
import { graph } from '@/lib/react_agent/graph';
import { defaultConfiguration } from '@/lib/react_agent/configuration';
import { GraphAnnotation } from '@/lib/react_agent/state';
import { getUID } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongo/connection';
import { User, Project, IUser } from '@/lib/mongo/model';
import { Types } from 'mongoose';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ project_id: string, topic_id: string }> }
) {
  const { project_id, topic_id } = await params;
  try {
    const { input_query } = await request.json();
    if (!input_query) {
      return new Response('Missing input_query', { status: 400 });
    }

    // Get user authentication
    const uid = getUID(request);
    if (!uid) {
      return new Response('Unauthorized', { status: 401 });
    }

    // Connect to database and verify user permissions
    await connectToDatabase();
    const user: IUser | null = await User.findOne({ uid: uid });
    if (!user) {
      return new Response('User not found', { status: 404 });
    }

    // If project_id is provided, verify user has access
    if (project_id) {
      const project = await Project.findOne({ _id: project_id }).populate('team');
      if (!project) {
        return new Response('Project not found', { status: 404 });
      }
      
      const team = project.team;
      const isTeamMember = (team.users as Types.ObjectId[]).includes(user._id);
      if (!isTeamMember) {
        return new Response('Access denied', { status: 403 });
      }
    }

    // Initialize the graph state
    const initialState = GraphAnnotation.parse({
      input_query: input_query,
      research_note: "",
      plans: [],
      reviews: [],
      old_draft: [],
      new_draft: [],
      final_draft: [],
      reasonings: [],
    });

    // Configure the graph with user context
    const graphConfig = {
      configurable: {
        ...defaultConfiguration(),
        thread_id: topic_id,
        user_id: uid,
        project_id: project_id,
      },
    };

    // Create streaming response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Stream the graph execution
          const graphStream = await graph.withConfig(graphConfig).stream(initialState);
          
          for await (const chunk of graphStream) {
            const chunkData = JSON.stringify({
              data: chunk,
              timestamp: new Date().toISOString()
            });
            
            controller.enqueue(encoder.encode(`${chunkData}`));
          }
          controller.close();
        } catch (error) {
          console.error('Graph execution error:', error);
          const errorData = JSON.stringify({
            type: 'error',
            error: error instanceof Error ? error.message : 'Unknown error',
            timestamp: new Date().toISOString()
          });

          controller.enqueue(encoder.encode(` ${errorData}\n\n`));
          controller.close();
        }
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });

  } catch (error) {
    console.error('API error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      }), 
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
