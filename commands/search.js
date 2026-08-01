const { searchMusic, downloadAudioFile } = require('../utils/music');

module.exports = (bot) => {
  bot.onText(/\/search (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const query = match[1];

    await bot.sendMessage(chatId, `🔎 Buscando "${query}"...`);

    const results = await searchMusic(query);
    if (!results.length) {
      return bot.sendMessage(chatId, `❌ No encontré nada para "${query}"`);
    }

    const buttons = results.map(v => [{ text: v.title, callback_data: v.url }]);
    buttons.push([{ text: "➡️ Más resultados", callback_data: `more:${query}:7` }]);

    bot.sendMessage(chatId, `🎵 Resultados para "${query}":`, {
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

    await bot.sendMessage(chatId, "🎶 Descargando audio...");

    try {
      const filePath = await downloadAudioFile(data);
      await bot.sendAudio(chatId, filePath, { title: "Tu canción" });
    } catch (err) {
      await bot.sendMessage(chatId, "❌ Error al enviar el audio.");
    }

    if (["group", "supergroup"].includes(query.message.chat.type)) {
      bot.deleteMessage(chatId, query.message.message_id);
    }
  });
};
