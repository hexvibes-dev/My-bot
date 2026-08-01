const TelegramBot = require('node-telegram-bot-api');
const startCommand = require('./commands/start');
const helpCommand = require('./commands/help');
const searchCommand = require('./commands/search');
const privateSearch = require('./commands/privateSearch');
const aboutCommand = require('./commands/about');

const token = process.env.TELEGRAM_TOKEN;
const bot = new TelegramBot(token, { polling: true });

startCommand(bot);
helpCommand(bot);
searchCommand(bot);
privateSearch(bot);
aboutCommand(bot);
