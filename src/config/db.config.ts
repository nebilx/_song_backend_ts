import mongoose from "mongoose";

const connectDB = async () => {
	mongoose.set("strictQuery", false);

	try {
		await mongoose.connect(process.env.MONGO_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		console.log("\x1b[36m%s\x1b[0m", "DB Connected");
	} catch (err: unknown) {
		console.log(`DB Connection error: ${err.message}`);
	}
};

export default connectDB;
