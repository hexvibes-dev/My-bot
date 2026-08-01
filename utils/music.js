const ytSearch = require('yt-search');
const ytdl = require('ytdl-core');

async function searchMusic(query) {
  const results = await ytSearch(query);
  return results.videos.slice(0, 3).map(v => ({
    title: v.title,
    url: v.url
  }));
}

module.exports = { searchMusic };
