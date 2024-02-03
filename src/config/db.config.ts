import mongoose from "mongoose";

const connectDB = async () => {
  mongoose.set("strictQuery", false);

  try {
    if (process.env["MONGO_URI"])
      await mongoose.connect(process.env["MONGO_URI"], {});
    console.log("\x1b[36m%s\x1b[0m", "DB Connected");
  } catch (err: unknown | { message: string }) {
    const { message } = err as { message: string };
    console.log(`DB Connection error: ${message ?? err}`);
  }
};

export default connectDB;
