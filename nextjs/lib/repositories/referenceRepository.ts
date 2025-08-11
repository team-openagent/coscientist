import { BaseRepository } from './baseRepository';
import { Reference, COLLECTIONS } from '../../domain/model';

export class ReferenceRepository extends BaseRepository<Reference> {
  constructor() {
    super(COLLECTIONS.REFERENCES);
  }

  async findByProjectId(projectId: string): Promise<Reference[]> {
    return this.find({ project_id: projectId });
  }

  async findByUploaderId(uploaderId: string): Promise<Reference[]> {
    return this.find({ uploader_id: uploaderId });
  }

  async findByType(type: 'pdf' | 'image'): Promise<Reference[]> {
    return this.find({ type });
  }

  async findByProjectAndType(projectId: string, type: 'pdf' | 'image'): Promise<Reference[]> {
    return this.find({ project_id: projectId, type });
  }

  async deleteByProjectId(projectId: string): Promise<number> {
    const collection = await this.getCollection();
    const result = await collection.deleteMany({ project_id: projectId });
    return result.deletedCount || 0;
  }

  async getReferenceCountByProject(projectId: string): Promise<number> {
    return this.count({ project_id: projectId });
  }
}
