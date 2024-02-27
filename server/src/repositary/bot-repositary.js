const bot = require("./config/serverConfig");

class BotRepositary {
  constructor() {
    this.bot = bot;
  }
  async promptUser(chatId, input_prompt) {
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
      throw error;
    }
  }
  async userConversation(chatId) {
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
        name: name,
        city: city,
        country: country,
      });
      await bot.sendMessage(chatId, `user's details have been saved!⭐`);
      await bot.sendMessage(chatId, `Welcome to Weather_Updates ${name}`);
      // await botEngagement(chatId)
    } catch (error) {
      console.log("error", error.message, error.statusCode);
    }
  }
}
