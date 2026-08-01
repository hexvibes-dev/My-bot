const ytSearch = require('yt-search');
const ytdl = require('ytdl-core');

async function searchMusic(query, offset = 0, limit = 7) {
  const results = await ytSearch(query);
  return results.videos.slice(offset, offset + limit).map(v => ({
    title: v.title,
    url: v.url
  }));
}

async function downloadAudio(url) {
  return ytdl(url, { filter: 'audioonly' });
}

module.exports = { searchMusic, downloadAudio };
