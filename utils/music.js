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

// híbrido: buffer si <5 min, archivo temporal si >=5 min
async function downloadAudioHybrid(url) {
  const info = await ytdl.getInfo(url);
  const duration = parseInt(info.videoDetails.lengthSeconds, 10);

  if (duration < 300) { // menos de 5 minutos → buffer
    const chunks = [];
    return new Promise((resolve, reject) => {
      ytdl(url, { filter: 'audioonly' })
        .on('data', chunk => chunks.push(chunk))
        .on('end', () => resolve(Buffer.concat(chunks)))
        .on('error', reject);
    });
  } else { // más de 5 minutos → archivo temporal
    const filePath = `/tmp/audio.mp3`;
    return new Promise((resolve, reject) => {
      ytdl(url, { filter: 'audioonly' })
        .pipe(fs.createWriteStream(filePath))
        .on('finish', () => resolve(filePath))
        .on('error', reject);
    });
  }
}

module.exports = { searchMusic, downloadAudioHybrid };
