import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import fetchWeather from "./libs/fetchWeather.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({
  path: join(__dirname, `.env.${process.env.NODE_ENV}`),
});

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    methods: "GET,POST",
    credentials: true,
  })
);

app.post("/weather", async (req, res) => {
  try {
    const { latitude, longitude } = req.body;

    const weatherData = await fetchWeather(latitude, longitude);

    res.json(weatherData);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch weather data" });
  }
});

app.get("*", (req, res) => {
  res.send("Documentation");
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});
