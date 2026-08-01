module.exports = (bot) => {
  bot.onText(/\/about/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'ℹ️ Este bot fue creado para ayudarte a buscar y descargar música fácilmente desde YouTube. Desarrollado por Kei, pensado para funcionar tanto en grupos como en chats privados. Usa /help para ver todos los comandos disponibles.');
  });
};
