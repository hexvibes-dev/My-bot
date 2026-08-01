const { searchMusic } = require('../utils/music');

module.exports = (bot) => {
  bot.onText(/\/search (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const query = match[1];
    const results = await searchMusic(query);

    if (!results.length) {
      return bot.sendMessage(chatId, '😔 Lo siento, no encontré resultados.');
    }

    const buttons = results.map(v => [{ text: v.title, callback_data: v.url }]);

    bot.sendMessage(chatId, '🎵 Resultados encontrados:', {
      reply_markup: { inline_keyboard: buttons }
    });
  });

  bot.on('callback_query', async (query) => {
    const chatId = query.message.chat.id;
    const url = query.data;

    await bot.deleteMessage(chatId, query.message.message_id);
    bot.sendAudio(chatId, url);
  });
};
