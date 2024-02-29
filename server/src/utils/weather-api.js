const axios = require("axios");
const {WEATHER_API} = require("../config/serverConfig");
const getWeatherUpdates = async (city) => {
  console.log("---city", city);
  try {
    const res = await axios.get(
      `https://api.weatherapi.com/v1/current.json?key=${WEATHER_API}&q=${city}`
    );
    const data = res.data;
    return data;
  } catch (error) {
    console.log("error in weather", error.message, error.statusCode);
  }
};

module.exports = {getWeatherUpdates};
