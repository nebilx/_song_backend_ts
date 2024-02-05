import { NextFunction, Request, Response } from "express";
import Song from "../model/song.model";
import Genre from "../config/genre.config";
import { errorMsg } from "../type/index.type";

export const genre = async (_req: Request, res: Response) => {
  if (!Genre) {
    throw { status: 204, message: "Genre Not Found" };
  }
  res.status(200).json({ data: Genre });
};

export const create_song = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, artist, album, genre } = req.body;

    if (!title || !artist || !album || !genre) {
      throw { status: 400, message: "Missing required fields" };
    }

    const songExist = await Song.findOne({ title, artist, genre, album });

    if (songExist) {
      throw { status: 400, message: "Song Already Exists" };
    }

    const song = new Song({ title, artist, album, genre });
    await song.save();

    return res.status(201).json({ message: "Song Created" });
  } catch (e: { message: string; status: number } | unknown) {
    const { status, message } = handleRequestError(e, next);
    return next({ status, message });
  }
};

export const get_song = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const songs = await Song.find();

    if (!songs || songs.length === 0) {
      throw { status: 204, message: "No Songs Found" };
    }

    return res.status(200).json({ data: songs });
  } catch (e: { message: string; status: number } | unknown) {
    const { status, message } = handleRequestError(e, next);
    return next({ status, message });
  }
};

export const update_song = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const { title, artist, album, genre } = req.body;

  if (!id) {
    throw { status: 400, message: "Song ID Required" };
  }

  try {
    const song = await Song.findByIdAndUpdate(
      id,
      { title, artist, album, genre },
      { new: true }
    );

    if (!song) {
      throw { status: 400, message: "No Song Found" };
    }

    return res.status(201).json({ message: "Song Updated", data: song });
  } catch (e: { message: string; status: number } | unknown) {
    const { status, message } = handleRequestError(e, next);
    return next({ status, message });
  }
};

export const remove_song = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    if (!id) {
      throw { status: 400, message: "Song ID Required" };
    }

    const songExist = await Song.findById(id);

    if (!songExist) {
      throw { status: 204, message: "No Song Found" };
    }

    await Song.findByIdAndDelete(id);

    return res.status(201).json({ message: "Song Deleted" });
  } catch (e: { message: string; status: number } | unknown) {
    const { status, message } = handleRequestError(e, next);
    return next({ status, message });
  }
};

export const generate_statistics = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const noSongTotal = await Song.aggregate([
      {
        $group: {
          _id: null,
          noSong: { $addToSet: "$title" },
          noAlbum: { $addToSet: "$album" },
          noArtist: { $addToSet: "$artist" },
          noGenre: { $addToSet: "$genre" },
        },
      },
      {
        $project: {
          _id: 0,
          title: { $size: "$noSong" },
          album: { $size: "$noAlbum" },
          artist: { $size: "$noArtist" },
          genre: { $size: "$noGenre" },
        },
      },
    ]);

    const noSongGenre = await Song.aggregate([
      {
        $group: {
          _id: "$genre",
          noSong: { $addToSet: "$title" },
        },
      },
      {
        $project: {
          _id: 0,
          genre: "$_id",
          title: { $size: "$noSong" },
        },
      },
    ]);

    const noSongAndAlbumArtist = await Song.aggregate([
      {
        $group: {
          _id: "$artist",
          noSong: { $addToSet: "$title" },
          noAlbum: { $addToSet: "$album" },
        },
      },
      {
        $project: {
          _id: 0,
          artist: "$_id",
          title: { $size: "$noSong" },
          album: { $size: "$noAlbum" },
        },
      },
    ]);

    const noSongAlbum = await Song.aggregate([
      {
        $group: {
          _id: "$album",
          noSong: { $addToSet: "$title" },
        },
      },
      {
        $project: {
          _id: 0,
          album: "$_id",
          title: { $size: "$noSong" },
        },
      },
    ]);

    return res.status(200).json({
      data: {
        noSongTotal: noSongTotal[0],
        noSongGenre,
        noSongAndAlbumArtist,
        noSongAlbum,
      },
    });
  } catch (e: { message: string; status: number } | unknown) {
    const { status, message } = handleRequestError(e, next);
    return next({ status, message });
  }
};

const handleRequestError = (
  error: { message: string; status: number } | unknown,
  _next: NextFunction
): errorMsg => {
  const { message, status } = error as {
    message: string;
    status: number;
  };

  if (!message) {
    return { status: 500, message: "Internal Server Error" };
  }

  return { status, message };
};
