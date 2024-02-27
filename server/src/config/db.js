const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const dbURI = process.env.DB_URI;
async function connectDb() {
  try {
    const client = await mongoose.connect(dbURI);
    console.log("Connected to MongoDB");
    return client;
  } catch (error) {
    console.log("Errror", error);
  }
}
module.exports = connectDb;
