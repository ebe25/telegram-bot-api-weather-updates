const connectDb = require("./config/db");
const User = require("./model/User");
const {bot} = require("./config/serverConfig");
const {getWeatherUpdates} = require("./utils/weather-api");
const {UserRepo} = require("./repositary/user-repositary");

const userRepo = new UserRepo();
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
    const newUser = await User.create({
      name: name,
      city: city,
      country: country,
      chatId: chatId,
    });
    console.log("newUserCreated!!!", newUser);
    await bot.sendMessage(chatId, `user's details have been saved!⭐`);
    await bot.sendMessage(chatId, `Welcome to Weather_Updates ${name}`);
    const currentChat = await bot.getChat(chatId);
    console.log("track of cureent chat", currentChat);
    await getWeatherUpdates(city);
  } catch (error) {
    console.log("error", error.message, error.statusCode);
  }
};

console.log("Bot is running");
bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  if (msg.text === "/start") {
    userConversation(chatId);
  } else if (msg.text.length !== 0 && msg.text !== "/start") {
    const city = await userRepo.getCity(chatId);
    await getWeatherUpdates(city);
  }
});

// bot.onText(/\/echo(.+)/, (msg, match) => {
//   // The 'msg' is the received Message from Telegram
//   // and 'match' is the result of executing the regexp
//   // above on the text content of the message

//   const chatId = msg.chat.id;

//   // The captured "whatever"
//   const resp = match[1];

//   // send back the matched "whatever" to the chat
//   bot.sendMessage(chatId, resp);
// });

// bot
//   .setMyCommands([
//     {command: "/updates", description: "gets the current weather updates"},
//     {command: "/messages", description: "testing"},
//     {
//       command: "/echo",
//       description: "echos whatever you write to the bot",
//     },
//   ])
//   .then(() => console.log("cmds being set now"));
// bot.getMyCommands().then((cmd) => console.log(cmd));

// console.log("data", getWeatherUpdates());

bot.on("polling_error", (err) => console.log(err));
bot.on("webhook_error", (err) => console.log(err));

// bot.on("message", async (msg) => {
//   console.log("---888", msg);
//   await bot.setMyCommands([
//     {
//       command: "/echo",
//       description: "echos whatever you write to the bot, no more alone time 😆",
//     },
//   ]);
//   await bot.getMyCommands();
// });
