const connectDb = require("./config/db");
const User = require("./model/User");
const {getWeatherUpdates} = require("./utils/weather-api");
const {UserRepo} = require("./repositary/user-repositary");
const {BotRepositary} = require("./repositary/bot-repositary");
const {bot} = require("./config/serverConfig");
const botInt = new BotRepositary();
async function setupAndStartServer() {
  console.log("Bot is running");
  try {
    connectDb();
    botInt.initiateBot();
    // const res = await botInt.getAllCommands();
    // console.log(res);
    // bot.setMyCommands([
    //   {
    //     command: "/start",
    //     description: "For new Users",
    //   },
    //   {
    //     command: "/help",
    //     description: "List out all the commands",
    //   },
    // ]);
  } catch (error) {
    console.log("server error", error);
  }
}

setupAndStartServer();
