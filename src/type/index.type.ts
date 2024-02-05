import { Document } from "mongoose";
import { SongSchema } from "../validation";
export interface errorMsg {
  status: number;
  message: string;
}

export type SongSchemaType = typeof SongSchema;

export interface Song extends Document {
  title: string;
  artist: string;
  album: string;
  genre: string;
  createdAt: Date;
  updatedAt: Date;
}
