import { BaseRepository } from './baseRepository';
import { Project, COLLECTIONS } from '../../domain/model';

export class ProjectRepository extends BaseRepository<Project> {
  constructor() {
    super(COLLECTIONS.PROJECTS);
  }

  async findByName(name: string): Promise<Project[]> {
    return this.find({ name: { $regex: name, $options: 'i' } });
  }

  async findPublicProjects(): Promise<Project[]> {
    return this.find({ is_public: true });
  }

  async findUserProjects(userId: string): Promise<Project[]> {
    // This would typically join with the teams collection
    // For now, we'll return projects where the user might have access
    return this.find({});
  }

  async updateProjectName(projectId: string, newName: string): Promise<boolean> {
    return this.update(projectId, { 
      $set: { 
        name: newName, 
        updated_at: new Date() 
      } 
    });
  }

  async makeProjectPublic(projectId: string): Promise<boolean> {
    return this.update(projectId, { 
      $set: { 
        is_public: true, 
        updated_at: new Date() 
      } 
    });
  }

  async makeProjectPrivate(projectId: string): Promise<boolean> {
    return this.update(projectId, { 
      $set: { 
        is_public: false, 
        updated_at: new Date() 
      } 
    });
  }
}
