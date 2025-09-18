import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongo/connection';
import { getUID } from '@/lib/auth';
import { Reference, IReference, User, Project, Team, IProject, ITeam, IUser } from '@/lib/mongo/model';
import { Types } from 'mongoose';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ project_id: string }> }
) {
  try {
    const { project_id } = await params;
    const uid = getUID(request);
    
    // Check if this is a multipart form data request (file upload)
    const contentType = request.headers.get('content-type') || '';
    
    if (contentType.includes('multipart/form-data')) {
      // Handle file upload
      const formData = await request.formData();
      const title = formData.get('title') as string;
      const type = formData.get('type') as string;
      const file = formData.get('file') as File;
      
      // Validate required fields
      if (!title || !file) {
        return NextResponse.json(
          { success: false, error: 'Title and file are required' },
          { status: 400 }
        );
      }
      
      // Validate file type
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json(
          { success: false, error: 'Invalid file type. Only PDF and image files are allowed.' },
          { status: 400 }
        );
      }
      
      // Validate file size (max 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        return NextResponse.json(
          { success: false, error: 'File size too large. Maximum size is 10MB.' },
          { status: 400 }
        );
      }
      
      await connectToDatabase();
      
      const user: IUser | null = await User.findOne({uid: uid});
      const project = await Project.findOne({_id: project_id}).populate('team');
      if (!project) {
        return NextResponse.json(
          { success: false, error: 'Project not found' },
          { status: 404 }
        );
      }

      const team = project.team;
      const isTeamMember = (team.users as Types.ObjectId[]).includes(user!._id);
      if (!isTeamMember) {
        return NextResponse.json(
          { success: false, error: 'User does not have permission to add references to this project' },
          { status: 403 }
        );
      }
      console.log("TITLE: ", title);

      const reference = new Reference({
        title: title,
        project: project_id,
        uploader: user!._id,
        type: type || (file.type === 'application/pdf' ? 'pdf' : 'image'),
        raw_data_path: `/uploads/references/${Date.now()}_${file.name}`,
      });
      
      // Save reference to database
      const savedReference = await reference.save();
      
      // TODO: Implement actual file storage (e.g., to cloud storage or local filesystem)
      // For now, we're just storing the metadata
      return NextResponse.json({
        reference: savedReference,
        message: 'Reference created successfully. File storage implementation needed.'
      });
      
    } else {
      // Handle regular JSON request (URL-based reference)
      const body = await request.json();
      
      // Validate required fields
      if (!body.title || !body.url) {
        return NextResponse.json(
          { success: false, error: 'Title and URL are required' },
          { status: 400 }
        );
      }
      
      await connectToDatabase();
      
      // Create reference object
      const uploader = await User.findOne({uid: uid})!.select('_id');
      console.log("UPLOADER: ", uploader!._id);
      const newReference: IReference = new Reference({
        project: project_id,
        uploader: uploader,
        type: body.type,
        //raw_data_path: body.url,
      });
      
      // Save reference to database
      newReference.save();
      
      return NextResponse.json({
        success: true,
        data: {
          reference: newReference
        }
      });
    }

  } catch (error) {
    console.error('Error creating reference:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest, props: { params: Promise<{ project_id: string }> }) {
  try {
    const params = await props.params;
    const { project_id } = params;
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
        { success: false, error: 'User does not have permission to access this project' },
        { status: 403 }
      );
    }
    
    // Get all references for the project
    const references = await Reference
      .find({ project: project_id })
      .populate('uploader', 'display_name email')
      .sort({ created_at: -1 })
      .lean();

    return NextResponse.json({
      references: references
    });

  } catch (error) {
    console.error('Error fetching references:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ project_id: string; reference_id: string }> }
) {
  try {
    const { project_id, reference_id } = await params;
    const uid = getUID(request);
    
    if (!reference_id) {
      return NextResponse.json(
        { success: false, error: 'Reference ID is required' },
        { status: 400 }
      );
    }
    
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
        { success: false, error: 'User does not have permission to access this project' },
        { status: 403 }
      );
    }
    
    // Find the reference and check if it exists
    const reference = await Reference.findById(reference_id);
    if (!reference) {
      return NextResponse.json(
        { success: false, error: 'Reference not found' },
        { status: 404 }
      );
    }
    
    // Check if the reference belongs to the specified project
    if (reference.project.toString() !== project_id) {
      return NextResponse.json(
        { success: false, error: 'Reference does not belong to this project' },
        { status: 400 }
      );
    }
    
    // Check if user is the uploader or has admin permissions
    // For now, only the uploader can delete their own references
    // You can extend this to allow team admins to delete any reference
    if (reference.uploader.toString() !== user._id.toString()) {
      return NextResponse.json(
        { success: false, error: 'Only the reference uploader can delete this reference' },
        { status: 403 }
      );
    }
    
    // Delete the reference
    await Reference.findByIdAndDelete(reference_id);
    
    // TODO: If you implement file storage, also delete the actual file here
    
    return NextResponse.json({
      success: true,
      message: 'Reference deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting reference:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
