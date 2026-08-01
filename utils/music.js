const ytSearch = require('yt-search');
const ytdl = require('ytdl-core');
const fs = require('fs');

async function searchMusic(query, offset = 0, limit = 7) {
  const results = await ytSearch(query);
  return results.videos.slice(offset, offset + limit).map(v => ({
    title: v.title,
    url: v.url
  }));
}

async function downloadAudioFile(url) {
  const filePath = `/tmp/audio.mp3`;
  return new Promise((resolve, reject) => {
    ytdl(url, { filter: 'audioonly' })
      .pipe(fs.createWriteStream(filePath))
      .on('finish', () => resolve(filePath))
      .on('error', reject);
  });
}

module.exports = { searchMusic, downloadAudioFile };
