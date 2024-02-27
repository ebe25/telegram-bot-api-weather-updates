const axios = require("axios");
const {WEATHER_API} = require("../config/serverConfig");
const getWeatherUpdates = async (city) => {
  try {
    const res = await axios.get(
      `https://api.weatherapi.com/v1/current.json?key=${WEATHER_API}=${city}`
    );
    return res.data;
  } catch (error) {
    console.log("error in weather", error.message, error.statusCode);
  }
};


module.exports = {getWeatherUpdates};
