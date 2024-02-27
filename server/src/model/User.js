const mongoose = require("mongoose");

const UserSchema = {
  name: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
    
  },
  country: {
    type: String,
    required: true,
  },
};
const schema = new mongoose.Schema(UserSchema, {timestamps: true});
const User = mongoose.model("Bot_User", schema);
module.exports = User;
