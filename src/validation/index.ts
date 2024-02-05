import Genre from "../config/genre.config";
import Joi from "joi";

export const SongSchema = Joi.object({
  title: Joi.string().min(3).max(30).trim().required(),
  artist: Joi.string().min(3).max(30).trim().required(),
  album: Joi.string().min(3).max(30).trim().required(),
  genre: Joi.string()
    .trim()
    .valid(...Genre)
    .required(),
}).options({ abortEarly: true });
