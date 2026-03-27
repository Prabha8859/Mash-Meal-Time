import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define MONGODB_URI in .env.local");
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    console.log("🚀 Using cached MongoDB connection");
    return cached.conn;
  }

  if (!cached.promise) {
    console.log("🔥 Creating new MongoDB connection");

    cached.promise = mongoose.connect(MONGODB_URI, {
      dbName: "mealmind_dev",
      serverSelectionTimeoutMS: 10000,
    });
  }

  try {
    cached.conn = await cached.promise;
    console.log("✅ MongoDB Connected");
  } catch (error) {
    cached.promise = null;
    console.error("❌ Connection failed:", error);
    throw error;
  }

  return cached.conn;
}

export default connectDB;