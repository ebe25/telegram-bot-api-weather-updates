const {bot} = require("../config/serverConfig");
const {UserRepo} = require("../repositary/user-repositary");
const {getWeatherUpdates} = require("../utils/weather-api");
class BotRepositary {
  constructor() {
    this.bot = bot;
    this.user = new UserRepo();
  }
  async invokeInput(chatId, input_prompt) {
    try {
      const prompt = await this.bot.sendMessage(chatId, input_prompt, {
        reply_markup: {
          force_reply: true,
        },
      });
      return new Promise((resolve) => {
        this.bot.onReplyToMessage(chatId, prompt.message_id, (reply) => {
          resolve(reply.text);
        });
      });
    } catch (error) {
      console.log("error", error);
      throw error;
    }
  }
  async userConversation(chatId) {
    try {
      const name = await this.invokeInput(chatId, "Please enter your name");
      const city = await this.invokeInput(chatId, "Please enter your city");
      const country = await this.invokeInput(
        chatId,
        "Please enter your country"
      );
      await this.bot.sendMessage(
        chatId,
        `Generating current weather report for ${city},${country}...`
      );
      await this.bot.sendMessage(chatId, `user's details have been saved!⭐`);
      await this.bot.sendMessage(chatId, `Welcome to Weather_Updates ${name}`);
      const newUser = await this.user.create({
        name: name,
        city: city,
        country: country,
        chatId: chatId,
      });
      console.log("User created", newUser);
    } catch (error) {
      console.log("error", error.message, error.statusCode);
    }
  }
  async setBotCommands(chatId, botInstance, commands) {
    try {
      const res = await botInstance.setMyCommand(commands);
      return res;
    } catch (error) {
      console.log("Somwthing wrong in repo layer", error);
      throw error;
    }
  }
  initiateBot() {
    this.bot.on("message", async (msg) => {
      const chatId = msg.chat.id;
      if (msg.text === "/start") {
        this.userConversation(chatId);
      } else if (msg.text === "/help") {
        const res = await this.helpCommand(chatId);
        console.log("repon", res);
        const res2 = await this.commandsFlow(chatId, res);
        console.log("commands", res2);
      }
      // } else if(msg.text !=="/start" && msg.text!=="/help") {
      //   this.randomCommands();
      // }
    });
    this.bot.on("polling_error", (err) => console.log(err.message));
    this.bot.on("webhook_error", (err) => console.log(err));
  }
  async helpCommand(chatId) {
    try {
      const helpReply = await this.bot.sendMessage(
        chatId,
        `The Bot commands are as follows:\n/subscribe: Subcribe to the bot\n/weather: Get the current weather updates\n/unsubscribe: Unsubscribe from the bot
      `,
        {
          reply_markup: {
            force_reply: true,
          },
        }
      );
      return new Promise((resolve) => {
        this.bot.onReplyToMessage(
          chatId,
          helpReply.message_id,
          async (reply) => {
            resolve(reply.text);
          }
        );
      });
    } catch (error) {
      console.log("error", error);
      throw error;
    }
  }

  async commandsFlow(chatId, message) {
    console.log("msg", message);
    try {
      if (message === "/subscribe") {
        console.log("----idher");
        return await this.bot.sendMessage(
          chatId,
          `You have subscribed to weather updates!\nYou can access weather updates\n using /weather command.\nYou can unsubscribe from weather updates using /unsubscribe command.\n\nSend your location to this bot to get notified of weather updates in your area.`
        );
      } else if (message === "/weather") {
        const replyCityPrompt = await this.bot.sendMessage(
          chatId,
          "Enter the city name you want weather updates for?\nOr you want your current weather update?",
          {
            reply_markup: {
              force_reply: true,
            },
          }
        );
        const reply = await this.getReplyToMessage(
          chatId,
          replyCityPrompt.message_id
        );
        console.log("reply to weather city", reply);

        const res = await getWeatherUpdates(reply);
        this.templateData(res, chatId);
      } else {
        return await this.bot.sendMessage(
          chatId,
          "You have unsubscribed from weather updates bot!"
        );
      }
    } catch (error) {
      console.log("error", error);
      throw error;
    }
  }

  randomCommands() {
    try {
      this.bot.on("message", async (msg) => {
        await this.bot.sendMessage(
          msg.chat.id,
          `You have already subscribed to weather updates!

        Send your current location to get notified of weather updates in your area.`
        );
      });
    } catch (error) {
      console.log("error", error.message);
      throw error;
    }
  }

  async getAllCommands() {
    return await this.bot.getMyCommands();
  }

  async getReplyToMessage(chatId, messageId) {
    try {
      return new Promise((resolve) => {
        this.bot.onReplyToMessage(chatId, messageId, (reply) =>
          resolve(reply.text)
        );
      });
    } catch (error) {
      console.log("error", error.message);
      throw error;
    }
  }

  async templateData(res, chatId) {
    try {
      const {location, current, wind_kph, humidity, cloud, feelslike_c} = res;
      const info = `Current weather update for ${location.name},${location.region}${location.country}:
      🌡️Temp:${current.temp_c},
      🍁Condition:{
        ${current.condition.text},
        ${current.condition.icon}
      },
      💨Wind: ${current.wind_kph},
      🌲Humidity:${current.humidity},
      FeelsLikeC:${current.feelslike_c}
           `;
      await this.bot.sendMessage(chatId, info);
    } catch (error) {
      console.log("error", error.message);
      throw error;
    }
  }
}

module.exports = {BotRepositary};
