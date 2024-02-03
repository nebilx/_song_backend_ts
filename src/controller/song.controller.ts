import { Request, Response } from "express";
import Song from "../model/song.model";
import Genre from "../config/genre.config";

export const genre = async (_req: Request, res: Response) => {
	res.status(200).json({ data: Genre });
};

export const create_song = async (req: Request, res: Response) => {
	try {
		const { title, artist, album, genre } = req.body;

		const songExist = await Song.findOne({ title, artist, genre, album });

		if (songExist)
			return res
				.status(400)
				.json({ success: false, message: "Song Already Exists" });

		const song = new Song({ title, artist, album, genre });
		await song.save();

		return res.status(201).json({ success: true, message: "Song Created" });
	} catch (e) {
		return res.status(500).json({ success: false, message: e });
	}
};

export const get_song = async (_req: Request, res: Response) => {
	try {
		const songs = await Song.find();

		if (!songs || songs.length === 0)
			return res
				.status(204)
				.json({ success: false, message: "No Songs Found" });

		return res.status(200).json({ success: true, data: songs });
	} catch (e) {
		return res.status(500).json({ success: false, message: e });
	}
};

export const update_song = async (req: Request, res: Response) => {
	const { id } = req.params;
	const { title, artist, album, genre } = req.body;

	if (!id)
		return res
			.status(400)
			.json({ success: false, message: "Song ID Required" });

	try {
		const song = await Song.findByIdAndUpdate(
			id,
			{ title, artist, album, genre },
			{ new: true },
		);

		if (!song)
			return res.status(204).json({ success: false, message: "No Song Found" });

		return res
			.status(201)
			.json({ success: true, message: "Song Updated", data: song });
	} catch (e) {
		return res.status(500).json({ success: false, message: e });
	}
};

export const remove_song = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;

		if (!id)
			return res
				.status(400)
				.json({ success: false, message: "Song ID Required" });

		const songExist = await Song.findById(id);

		if (!songExist)
			return res.status(204).json({ success: false, message: "No Song Found" });

		await Song.findByIdAndDelete(id);

		return res.status(201).json({ success: true, message: "Song Deleted" });
	} catch (e) {
		return res.status(500).json({ success: false, message: e });
	}
};

export const generate_statistics = async (_req: Request, res: Response) => {
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
			success: true,
			data: {
				noSongTotal,
				noSongGenre,
				noSongAndAlbumArtist,
				noSongAlbum,
			},
		});
	} catch (e) {
		return res.status(500).json({ success: false, message: e });
	}
};
