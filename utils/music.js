const play = require('play-dl');
const fs = require('fs');

async function searchMusic(query, offset = 0, limit = 7) {
  const results = await play.search(query, { limit: limit + offset });
  return results.slice(offset, offset + limit).map(v => ({
    title: v.title,
    url: v.url
  }));
}

async function downloadAudioFile(url) {
  const info = await play.video_info(url);
  const stream = await play.stream(info.url);
  const filePath = '/tmp/audio.mp3';
  return new Promise((resolve, reject) => {
    const writeStream = fs.createWriteStream(filePath);
    stream.stream.pipe(writeStream);
    writeStream.on('finish', () => resolve(filePath));
    writeStream.on('error', reject);
  });
}

module.exports = { searchMusic, downloadAudioFile };
