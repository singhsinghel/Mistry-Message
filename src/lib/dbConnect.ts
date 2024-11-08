import mongoose from "mongoose";

type connectionObject = {
  isConnected?: number;
};
const connection: connectionObject = {};

export const dbConnect = async (): Promise<void> => {
  if (connection.isConnected) {
    return;
  }
  try {
    const db = await mongoose.connect(process.env.MONGO_URI || "");
    connection.isConnected = db.connections[0].readyState;
    console.log("db connected successfully");
  } catch (error) {
    console.log("Error occured whole connecting data", error);
    process.exit(1);
  }
}; 
