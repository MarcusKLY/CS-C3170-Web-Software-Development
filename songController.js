import { Eta } from "https://deno.land/x/eta@v3.4.0/src/index.ts";
import * as songService from "./songService.js";

const eta = new Eta({ views: `${Deno.cwd()}/templates/` });

const showForm = async (c) => {
  return c.html(
    eta.render("index.eta", { songs: await songService.listSongs() }),
  );
};

const createSong = async (c) => {
		const body = await c.req.parseBody();
		await songService.createSong(body);
		return c.redirect("/");
}

export	{ showForm };