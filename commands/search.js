const { searchMusic, downloadAudioHybrid } = require('../utils/music');

module.exports = (bot) => {
  bot.onText(/\/search (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const query = match[1];

    // Mensaje de referencia de búsqueda
    const loadingMsg = await bot.sendMessage(chatId, `🔎 Buscando "${query}"...`);

    const results = await searchMusic(query);
    if (!results.length) {
      return bot.editMessageText(`❌ No encontré nada para "${query}"`, {
        chat_id: chatId,
        message_id: loadingMsg.message_id
      });
    }

    const buttons = results.map(v => [{ text: v.title, callback_data: v.url }]);
    buttons.push([{ text: "➡️ Más resultados", callback_data: `more:${query}:7` }]);

    bot.editMessageText(`🎵 Resultados para "${query}":`, {
      chat_id: chatId,
      message_id: loadingMsg.message_id,
      reply_markup: { inline_keyboard: buttons }
    });
  });

  bot.on('callback_query', async (query) => {
    const chatId = query.message.chat.id;
    const data = query.data;

    if (data.startsWith("more:")) {
      const [, q, offset] = data.split(":");
      const results = await searchMusic(q, parseInt(offset), 7);
      const buttons = results.map(v => [{ text: v.title, callback_data: v.url }]);
      buttons.push([{ text: "➡️ Más resultados", callback_data: `more:${q}:${parseInt(offset) + 7}` }]);

      return bot.editMessageText(`🎵 Más resultados para "${q}":`, {
        chat_id: chatId,
        message_id: query.message.message_id,
        reply_markup: { inline_keyboard: buttons }
      });
    }

    // Indicador de descarga
    await bot.sendMessage(chatId, "🎶 Descargando audio...");

    try {
      const audio = await downloadAudioHybrid(data);

      // Validar si es Buffer o ruta de archivo
      if (Buffer.isBuffer(audio)) {
        await bot.sendAudio(chatId, audio, { title: "Tu canción" });
      } else {
        await bot.sendAudio(chatId, audio, { title: "Tu canción" });
      }
    } catch (err) {
      await bot.sendMessage(chatId, "❌ Error al enviar el audio.");
    }

    // Borrar solo en grupos
    if (["group", "supergroup"].includes(query.message.chat.type)) {
      bot.deleteMessage(chatId, query.message.message_id);
    }
  });
};
