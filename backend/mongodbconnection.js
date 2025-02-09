import { MongoClient } from 'mongodb';
import dotenv from "dotenv";
dotenv.config();

const uri = config.MONGODB_URI;

const client = new MongoClient(uri, { tls: false }); // Disable TLS for debugging

async function connectDB() {
  try {
    await client.connect();
    console.log("Connected to MongoDB!");
  } catch (error) {
    console.error("MongoDB Connection Error:", error);
  }
}

connectDB();
