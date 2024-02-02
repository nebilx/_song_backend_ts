import mongoose, { Schema, Document } from "mongoose";
import Genre from "../config/genre.config";

export interface Song extends Document {
	title: string;
	artist: string;
	album: string;
	genre: string;
	createdAt: Date;
	updatedAt: Date;
}

const songSchema: Schema = new Schema(
	{
		title: {
			type: String,
			required: [true, "song title is required"],
			trim: true,
			match: /^[a-zA-Z0-9-_$.]+$/,
		},
		artist: {
			type: String,
			required: [true, "song artist is required"],
			trim: true,
			match: /^[a-zA-Z-_$.]+$/,
		},
		album: {
			type: String,
			required: [true, "song album is required"],
			trim: true,
			match: /^[a-zA-Z-_$.]+$/,
		},
		genre: {
			type: String,
			required: [true, "song genre is required"],
			trim: true,
			enum: Genre,
		},
	},
	{ timestamps: true },
);

const Song = mongoose.model<Song>("Song", songSchema);

export default Song;
