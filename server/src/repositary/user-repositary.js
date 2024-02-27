const User = require("../model/User");
class UserRepo {
  constructor() {
    this.model = User;
  }
  async create(data) {
    try {
      const user = await User.create({data});
      return user;
    } catch (error) {
      throw error;
    }
  }
  async getCity(chatId) {
    try {
      const city = await this.model.findOne({chatId: chatId}).exec();
      return city;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = {UserRepo};
