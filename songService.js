const songs = [];

export function addSong(name, duration) {
    songs.push({ name, duration });
}

export function getSongs() {
    return songs;
}