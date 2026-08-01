const play = require('play-dl');
const fs = require('fs');

async function searchMusic(query, offset = 0, limit = 7) {
  console.log(`[UTILS] Buscando en play-dl: ${query}`);
  try {
    const results = await play.search(query, { limit: limit + offset });
    console.log(`[UTILS] play-dl devolvió ${results.length} resultados`);
    return results.slice(offset, offset + limit).map(v => ({
      title: v.title,
      url: v.url
    }));
  } catch (err) {
    console.error("[UTILS] Error en searchMusic:", err);
    return [];
  }
}

async function downloadAudioFile(url) {
  console.log(`[UTILS] Descargando audio de: ${url}`);
  try {
    const info = await play.video_info(url);
    console.log(`[UTILS] Video info OK: ${info.video_details.title}`);
    const stream = await play.stream(info.url);
    console.log("[UTILS] Stream abierto correctamente");
    const filePath = '/tmp/audio.mp3';
    return new Promise((resolve, reject) => {
      const writeStream = fs.createWriteStream(filePath);
      stream.stream.pipe(writeStream);
      writeStream.on('finish', () => {
        console.log(`[UTILS] Audio guardado en ${filePath}`);
        resolve(filePath);
      });
      writeStream.on('error', (err) => {
        console.error("[UTILS] Error escribiendo archivo:", err);
        reject(err);
      });
    });
  } catch (err) {
    console.error("[UTILS] Error en downloadAudioFile:", err);
    throw err;
  }
}

module.exports = { searchMusic, downloadAudioFile };
