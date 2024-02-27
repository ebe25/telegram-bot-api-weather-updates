const TelegramBot = require("node-telegram-bot-api");
const dotenv = require("dotenv");
dotenv.config();
const token = process.env.TOKEN;
const bot = new TelegramBot(token, {polling: true});
const WEATHER_API = process.env.WEATHER_API;
module.exports = {bot, WEATHER_API};
