import { Collection, ObjectId, Filter, UpdateFilter, FindOptions } from 'mongodb';
import { getCollection } from '../mongodb';

export abstract class BaseRepository<T> {
  protected collectionName: string;
  protected collection: Collection<T>;

  constructor(collectionName: string) {
    this.collectionName = collectionName;
  }

  protected async getCollection(): Promise<Collection<T>> {
    if (!this.collection) {
      this.collection = await getCollection<T>(this.collectionName);
    }
    return this.collection;
  }

  async create(data: T): Promise<T> {
    const collection = await this.getCollection();
    const result = await collection.insertOne(data);
    return { ...data, _id: result.insertedId } as T;
  }

  async findById(id: string): Promise<T | null> {
    const collection = await this.getCollection();
    return collection.findOne({ _id: new ObjectId(id) } as Filter<T>);
  }

  async findOne(filter: Filter<T>): Promise<T | null> {
    const collection = await this.getCollection();
    return collection.findOne(filter);
  }

  async find(filter: Filter<T>, options?: FindOptions<T>): Promise<T[]> {
    const collection = await this.getCollection();
    return collection.find(filter, options).toArray();
  }

  async update(id: string, update: UpdateFilter<T>): Promise<boolean> {
    const collection = await this.getCollection();
    const result = await collection.updateOne(
      { _id: new ObjectId(id) } as Filter<T>,
      update
    );
    return result.modifiedCount > 0;
  }

  async delete(id: string): Promise<boolean> {
    const collection = await this.getCollection();
    const result = await collection.deleteOne({ _id: new ObjectId(id) } as Filter<T>);
    return result.deletedCount > 0;
  }

  async count(filter: Filter<T> = {}): Promise<number> {
    const collection = await this.getCollection();
    return collection.countDocuments(filter);
  }

  async exists(filter: Filter<T>): Promise<boolean> {
    const collection = await this.getCollection();
    return (await collection.countDocuments(filter)) > 0;
  }
}
