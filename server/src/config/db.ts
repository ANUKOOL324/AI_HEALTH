import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { env } from "./env";

export const connectToDatabase = async (): Promise<void> => {
  try {
    let uri = env.mongoUri;
    
    // Automatically use memory server if we don't have a real local db
    if (uri.includes("localhost:27017/ai_health") || uri.includes("dummy")) {
      const mongoServer = await MongoMemoryServer.create();
      uri = mongoServer.getUri();
      console.log(`[db] Started in-memory MongoDB at ${uri}`);
    }

    await mongoose.connect(uri);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed", error);
    throw error;
  }
};
