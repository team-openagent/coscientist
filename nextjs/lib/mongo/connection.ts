import { RunnableConfig } from '@langchain/core/runnables';
import { MongoDBSaver } from '@langchain/langgraph-checkpoint-mongodb';
import mongoose, { Mongoose } from 'mongoose';

const MONGO_URI = process.env.MONGODB_URI || "mongodb://root:secret@localhost:27017";


// Use a global variable to cache the mongoose connection across hot reloads in development
interface MongooseCache {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

declare global {
  var mongoose: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongoose || { conn: null, promise: null };

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGO_URI!, opts).then((mongoose) => {
      return mongoose;
    });
  }
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}


// override langgraph-checkpoint-mongodb
import {CheckpointTuple} from "@langchain/langgraph-checkpoint"
export class MongoDBCheckpointer extends MongoDBSaver {
  async *listByCheckpointId(config: RunnableConfig, checkpointIds?: string[]): AsyncGenerator<CheckpointTuple> { 
    const query: Record<string, unknown> = {};
    if (config?.configurable?.thread_id) {
        query.thread_id = config.configurable.thread_id;
    }
    if (checkpointIds) {
        query.checkpoint_id = { $in: checkpointIds };
    }
    if (config?.configurable?.checkpoint_ns !== undefined &&
        config?.configurable?.checkpoint_ns !== null) {
        query.checkpoint_ns = config.configurable.checkpoint_ns;
    }
    console.log(query);
    const result = this.db
        .collection(this.checkpointCollectionName)
        .find(query)
        .sort("checkpoint_id", -1);

    for await (const doc of result) {
        const checkpoint = (await this.serde.loadsTyped(doc.type, doc.checkpoint.value("utf8")));
        const metadata = (await this.serde.loadsTyped(doc.type, doc.metadata.value("utf8")));
        yield {
            config: {
                configurable: {
                    thread_id: doc.thread_id,
                    checkpoint_ns: doc.checkpoint_ns,
                    checkpoint_id: doc.checkpoint_id,
                },
            },
            checkpoint,
            metadata,
            parentConfig: doc.parent_checkpoint_id
                ? {
                    configurable: {
                        thread_id: doc.thread_id,
                        checkpoint_ns: doc.checkpoint_ns,
                        checkpoint_id: doc.parent_checkpoint_id,
                    },
                }
                : undefined,
        };
    }
  }
}

