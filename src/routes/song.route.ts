import express, { Router } from "express";
const songRouter: Router = express.Router();

import {
	create_song,
	get_song,
	update_song,
	remove_song,
	generate_statistics,
	genre,
} from "../controller/song.controller";

songRouter.route("/").post(create_song).get(get_song);
songRouter.route("/:id").put(update_song).delete(remove_song);
songRouter.route("/statics").get(generate_statistics);
songRouter.route("/genre").get(genre);

export default songRouter;
