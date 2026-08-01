const { searchMusic, downloadAudioFile } = require('../utils/music');

module.exports = (bot) => {
  bot.onText(/\/search (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const query = match[1];
    console.log(`[SEARCH] Query: ${query} from chat ${chatId}`);

    await bot.sendMessage(chatId, `🔎 Buscando "${query}"...`);

    try {
      const results = await searchMusic(query);
      console.log(`[SEARCH] Results: ${results.length}`);
      if (!results.length) {
        return bot.sendMessage(chatId, `❌ No encontré nada para "${query}"`);
      }

      const buttons = results.map(v => [{ text: v.title, callback_data: v.url }]);
      buttons.push([{ text: "➡️ Más resultados", callback_data: `more:${query}:7` }]);

      bot.sendMessage(chatId, `🎵 Resultados para "${query}":`, {
        reply_markup: { inline_keyboard: buttons }
      });
    } catch (err) {
      console.error("[SEARCH] Error buscando:", err);
      await bot.sendMessage(chatId, "❌ Error interno al buscar.");
    }
  });

  bot.on('callback_query', async (query) => {
    const chatId = query.message.chat.id;
    const data = query.data;
    console.log(`[CALLBACK] Data: ${data} from chat ${chatId}`);

    if (data.startsWith("more:")) {
      const [, q, offset] = data.split(":");
      try {
        const results = await searchMusic(q, parseInt(offset), 7);
        console.log(`[CALLBACK] More results: ${results.length}`);
        const buttons = results.map(v => [{ text: v.title, callback_data: v.url }]);
        buttons.push([{ text: "➡️ Más resultados", callback_data: `more:${q}:${parseInt(offset) + 7}` }]);

        return bot.editMessageText(`🎵 Más resultados para "${q}":`, {
          chat_id: chatId,
          message_id: query.message.message_id,
          reply_markup: { inline_keyboard: buttons }
        });
      } catch (err) {
        console.error("[CALLBACK] Error buscando más:", err);
        await bot.sendMessage(chatId, "❌ Error interno al buscar más resultados.");
      }
    }

    await bot.sendMessage(chatId, "🎶 Descargando audio...");

    try {
      const filePath = await downloadAudioFile(data);
      console.log(`[CALLBACK] Audio descargado en: ${filePath}`);
      await bot.sendAudio(chatId, filePath, { title: "Tu canción" });
      console.log("[CALLBACK] Audio enviado correctamente");
    } catch (err) {
      console.error("[CALLBACK] Error al enviar audio:", err);
      await bot.sendMessage(chatId, "❌ Error al enviar el audio.");
    }
  });
};
