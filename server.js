import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import cors from "cors";
import moment from "moment";
import { fileURLToPath } from "url";
import { dirname, join } from "path"; // Make sure to import 'join' from 'path'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({
  path: join(__dirname, `.env.${process.env.NODE_ENV || "development"}`),
});

const app = express();
const PORT = process.env.PORT;
const weather_URL = "https://api.openweathermap.org/data/2.5/";
const API_KEY = process.env.API_KEY;

app.use(express.json());
app.use(
  cors({
    origin: process.env.ORIGIN,
    methods: "GET,POST",
    credentials: true,
  })
);

function capFirstLetters(str) {
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

async function fetchWeatherData(latitude, longitude) {
  try {
    const curr_result = await axios.get(
      `${weather_URL}weather?units=metric&lat=${latitude}&lon=${longitude}&appid=${API_KEY}`
    );
    const currentWeather = curr_result.data;

    currentWeather.weather[0].description = capFirstLetters(
      currentWeather.weather[0].description
    );
    currentWeather.visibility = currentWeather.visibility / 1000;
    currentWeather.dt = moment()
      .utcOffset(currentWeather.timezone / 60)
      .format("dddd, hh:mm A");

    const forecast_result = await axios.get(
      `${weather_URL}forecast?units=metric&lat=${latitude}&lon=${longitude}&appid=${API_KEY}`
    );
    const forecastWeather = forecast_result.data;

    forecastWeather.list = forecastWeather.list.map((item) => {
      item.dt = moment(item.dt * 1000).format("hh:mm A");
      item.weather[0].description = capFirstLetters(
        item.weather[0].description
      );
      return item;
    });

    return { currentWeather, forecastWeather };
  } catch (error) {
    console.log(error);
    return { error: "Error fetching weather data" };
  }
}

app.post("/weather", async (req, res) => {
  try {
    const { latitude, longitude } = req.body;

    const weatherData = await fetchWeatherData(latitude, longitude);

    res.json(weatherData);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch weather data" });
  }
});

app.get("*", (req, res) => {
  res.send("Documentation");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
