const listSongs = async () => {
  const kv = await Deno.openKv();
  const songEntries = await kv.list({ prefix: ["songs"] });

  const songs = [];
  for await (const entry of songEntries) {
    songs.push(entry.value);
  }

  return songs;
};

export	{ listSongs };