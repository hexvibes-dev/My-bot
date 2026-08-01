module.exports = (bot) => {
  bot.onText(/\/help/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, '📖 Comandos disponibles:\n\n/start - Mensaje de bienvenida\n/help - Lista de comandos\n/search <canción> - Buscar música en grupos\n\nEn chats privados, solo escribe el nombre de la canción.');
  });
};
