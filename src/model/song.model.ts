import mongoose, { Schema } from "mongoose";
import Genre from "../config/genre.config";
import { Song } from "../type/index.type";

const songSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, "song title is required"],
      trim: true,
      match: /^[a-zA-Z0-9\s-_$.]+$/,
    },
    artist: {
      type: String,
      required: [true, "song artist is required"],
      trim: true,
      match: /^[a-zA-Z0-9\s-_$.]+$/,
    },
    album: {
      type: String,
      required: [true, "song album is required"],
      trim: true,
      match: /^[a-zA-Z0-9\s-_$.]+$/,
    },
    genre: {
      type: String,
      required: [true, "song genre is required"],
      trim: true,
      enum: Genre,
    },
  },
  { timestamps: true }
);

const Song = mongoose.model<Song>("Song", songSchema);

export default Song;
