const TelegramBot = require("node-telegram-bot-api");

const bot = new TelegramBot(process.env.TELE_ACCESS_TOKEN);
bot.setWebHook(`${process.env.BASE_API_URL}/tele-bot`);
