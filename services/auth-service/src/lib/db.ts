import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || "");
    console.log(`[DATABASE] MongoDB_Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[DATABASE_ERROR] ${error}`);
    process.exit(1); // Stop the service if the DB is offline
  }
};
