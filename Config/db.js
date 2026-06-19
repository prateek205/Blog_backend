import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGODB = process.env.MONGO_URI;

const connectDb = async () => {
  try {
    await mongoose.connect(MONGODB);
    console.log("🚀 Mongodb is connected");
  } catch (error) {
    console.log("❌ Mongodb is failed");
  }
};

export default connectDb;
