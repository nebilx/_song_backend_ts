import { Document } from "mongoose";
export interface errorMsg {
  status: number;
  message: string;
}

export interface Song extends Document {
  title: string;
  artist: string;
  album: string;
  genre: string;
  createdAt: Date;
  updatedAt: Date;
}
