const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const bodyParser = require('body-parser');

const startCommand = require('./commands/start');
const helpCommand = require('./commands/help');
const searchCommand = require('./commands/search');
const privateSearch = require('./commands/privateSearch');
const aboutCommand = require('./commands/about');

const token = process.env.TELEGRAM_TOKEN;
const bot = new TelegramBot(token);

const app = express();
app.use(bodyParser.json());

bot.setWebHook(`${process.env.WEBHOOK_URL}/webhook`);

app.post('/webhook', (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

startCommand(bot);
helpCommand(bot);
searchCommand(bot);
privateSearch(bot);
aboutCommand(bot);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Bot server running on port ${PORT}`);
});
