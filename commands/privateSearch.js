const { searchMusic } = require('../utils/music');

module.exports = (bot) => {
  bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    if (msg.chat.type !== 'private') return;
    if (msg.text.startsWith('/')) return;

    const query = msg.text;
    const results = await searchMusic(query);

    if (!results.length) {
      return bot.sendMessage(chatId, '😔 Lo siento, no encontré resultados.');
    }

    const buttons = results.map(v => [{ text: v.title, callback_data: v.url }]);

    bot.sendMessage(chatId, '🎶 Aquí tienes algunas opciones:', {
      reply_markup: { inline_keyboard: buttons }
    });
  });
};
