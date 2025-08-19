import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { getUID } from '@/lib/auth';
import { Reference, IReference, User, Project, Team, IProject, ITeam, IUser } from '@/domain/model';
import { } from "@/lib/firebase"
import { Types } from 'mongoose';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ project_id: string; reference_id: string }> }
) {
  try {
    const { project_id, reference_id } = await params;
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
        { status: 403 }
      );
    }
    
    // Check if user is the uploader or has admin permissions
    // For now, only the uploader can delete their own references
    // You can extend this to allow team admins to delete any reference
    //if (reference.uploader.toString() !== user._id.toString()) {
    //  return NextResponse.json(
    //    { success: false, error: 'Only the reference uploader can delete this reference' },
    //    { status: 403 }
    //  );
    //}
    
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
