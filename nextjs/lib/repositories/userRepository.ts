import { BaseRepository } from './baseRepository';
import { User, COLLECTIONS } from '../../domain/model';

export class UserRepository extends BaseRepository<User> {
  constructor() {
    super(COLLECTIONS.USERS);
  }

  async findByFirebaseUid(firebaseUid: string): Promise<User | null> {
    return this.findOne({ user_id: firebaseUid });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.findOne({ email });
  }

  async updateUserPreferences(userId: string, preferences: User['preferences']): Promise<boolean> {
    return this.update(userId, { 
      $set: { 
        preferences, 
        updated_at: new Date() 
      } 
    });
  }

  async updateDisplayName(userId: string, displayName: string): Promise<boolean> {
    return this.update(userId, { 
      $set: { 
        display_name: displayName, 
        updated_at: new Date() 
      } 
    });
  }

  async updatePhotoUrl(userId: string, photoUrl: string): Promise<boolean> {
    return this.update(userId, { 
      $set: { 
        photo_url: photoUrl, 
        updated_at: new Date() 
      } 
    });
  }

  async createOrUpdateUser(userData: Omit<User, 'created_at' | 'updated_at'>): Promise<User> {
    const existingUser = await this.findByFirebaseUid(userData.user_id);
    
    if (existingUser) {
      await this.update(existingUser._id as string, {
        $set: {
          display_name: userData.display_name,
          email: userData.email,
          photo_url: userData.photo_url,
          updated_at: new Date()
        }
      });
      return { ...existingUser, ...userData, updated_at: new Date() };
    } else {
      const newUser: User = {
        ...userData,
        created_at: new Date(),
        updated_at: new Date()
      };
      return this.create(newUser);
    }
  }
}
