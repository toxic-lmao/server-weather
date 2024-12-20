import axios from "axios";
import moment from "moment";
import capFirstLetter from "./capFirstLetter.js";

export default async function fetchWeatherData(latitude, longitude) {
  try {
    console.log("fetched");
    const curr_result = await axios.get(
      `${process.env.API_URL}weather?units=metric&lat=${latitude}&lon=${longitude}&appid=${process.env.API_KEY}`
    );
    const currentWeather = curr_result.data;

    currentWeather.weather[0].description = capFirstLetter(
      currentWeather.weather[0].description
    );
    currentWeather.visibility = currentWeather.visibility / 1000;
    currentWeather.dt = moment()
      .utcOffset(currentWeather.timezone / 60)
      .format("dddd, hh:mm A");

    const forecast_result = await axios.get(
      `${process.env.API_URL}forecast?units=metric&lat=${latitude}&lon=${longitude}&appid=${process.env.API_KEY}`
    );
    const forecastWeather = forecast_result.data;

    forecastWeather.list = forecastWeather.list.map((item) => {
      return {
        ...item,
        dt: moment((item.dt + forecastWeather.city.timezone) * 1000).format(
          "hh:mm A"
        ),
        weather: item.weather.map((weather) => ({
          ...weather,
          description: capFirstLetter(weather.description),
        })),
      };
    });

    return { currentWeather, forecastWeather };
  } catch (error) {
    console.log(error);
    return error;
  }
}
