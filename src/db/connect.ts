import mongoose from "mongoose";

const connectDb = async () => {
  const { connection } = await mongoose.connect(String(process.env.MONGO_URI));

  console.log(`Database connected to ${connection.host}`);
};

export default connectDb;
