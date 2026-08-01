const TelegramBot = require('node-telegram-bot-api');

// Tu token de BotFather
const token = process.env.TELEGRAM_TOKEN;

// Inicializa el bot con polling
const bot = new TelegramBot(token, { polling: true });

// Responde al comando /start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, '¡Hola Kei! 🚀 Bienvenido a mi bot en Render.');
});
