import moment from "moment";
import { capFirstLetters } from "./capFirstLetter.js";

export const fetchWeather = async (latitude, longitude) => {
  try {
    console.log("fetched");
    const curr_result = await fetch(
      `${process.env.API_URL}weather?units=metric&lat=${latitude}&lon=${longitude}&appid=${process.env.API_KEY}`
    );
    const currentWeather = await curr_result.json();

    currentWeather.weather[0].description = capFirstLetters(
      currentWeather.weather[0].description
    );
    currentWeather.visibility = currentWeather.visibility / 1000;
    currentWeather.dt = moment()
      .utcOffset(currentWeather.timezone / 60)
      .format("dddd, hh:mm A");

    const forecast_result = await fetch(
      `${process.env.API_URL}forecast?units=metric&lat=${latitude}&lon=${longitude}&appid=${process.env.API_KEY}`
    );
    const forecastWeather = await forecast_result.json();

    forecastWeather.list = forecastWeather.list.map((item) => {
      return {
        ...item,
        dt: moment((item.dt + forecastWeather.city.timezone) * 1000).format(
          "hh:mm A"
        ),
        weather: item.weather.map((weather) => ({
          ...weather,
          description: capFirstLetters(weather.description),
        })),
      };
    });

    return { currentWeather, forecastWeather };
  } catch (error) {
    return error;
  }
};
