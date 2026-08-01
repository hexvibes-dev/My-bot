module.exports = (bot) => {
  bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, '👋 ¡Bienvenido! Este bot te ayuda a buscar y descargar música fácilmente. Usa /help para ver los comandos disponibles.');
  });
};
