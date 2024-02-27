const connectDb = require("./config/db");
const User = require("./model/User");
const bot = require("./config/serverConfig");
const axios = require("axios");
connectDb();

const invokeInput = async (chatId, input_prompt) => {
  try {
    const prompt = await bot.sendMessage(chatId, input_prompt, {
      reply_markup: {
        force_reply: true,
      },
    });
    return new Promise((resolve) => {
      bot.onReplyToMessage(chatId, prompt.message_id, (reply) => {
        resolve(reply.text);
      });
    });
  } catch (error) {
    console.log("error", error);
  }
};
const userConversation = async (chatId) => {
  try {
    const name = await invokeInput(chatId, "Please enter your name");
    const city = await invokeInput(chatId, "Please enter your city");
    // await bot.sendMessage(chatId, `Narrowing down the search input to ${city}`);
    const country = await invokeInput(chatId, "Please enter your country");
    await bot.sendMessage(
      chatId,
      `Generating current weather report for ${city},${country}...`
    );
    await User.create({
      name:name,
      city:city,
      country:country,
    })
    await bot.sendMessage(chatId, `${name}'s deatils have been saved!⭐`);
    await bot.sendMessage(chatId, `Welcome to Weather_Updates ${name}`);

  } catch (error) {
    console.log("error", error.message, error.statusCode);
  }
};
const getWeatherUpdates = async (city) => {
  try {
    const res = await axios.get(
      `https://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_API}=${city}`
    );
    console.log(res.data);
    return res.data;
  } catch (error) {
    console.log("error in weather", error.message, error.statusCode);
  }
};

console.log("Bot is running");
bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  if (msg.text === "/updates" || msg.text === "/start") {
    userConversation(chatId);
  }
});


// bot
//   .setMyCommands([
//     {command: "/updates", description: "gets the current awaeather updates"},
//     {command: "/messages", description: "testing"},
//   ])
//   .then(() => console.log("cmds being set now"));
// bot.getMyCommands().then((cmd) => console.log(cmd));
// bot.on("message", async()=>{
//   return await 
// })
// console.log("data", getWeatherUpdates());

bot.on("polling_error", console.log);
