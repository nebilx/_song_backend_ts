import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response } from "express";
const app = express();
import connectDB from "./config/db.config";
import songRoute from "./routes/song.route";

import cors from "cors";
const PORT = process.env["PORT"] || 5000;

// Connect to MongoDB
connectDB();

// Built-in middleware for JSON
app.use(express.json());

app.use(cors());

app.use("/api", songRoute);
app.use("*", (_req: Request, res: Response) =>
	res.status(404).json({ message: "No API Found" }),
);

app.listen(PORT, () =>
	console.log(`Server running at http://localhost:${PORT}`),
);
