import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { fetchWeather } from "./libs/fetchWeather.js";
import { searchLocation } from "./libs/searchLocation.js";

dotenv.config();

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
  const { latitude, longitude } = req.body;

  const weatherData = await fetchWeather(latitude, longitude);

  res.json(weatherData);
});

app.get("/search", async (req, res) => {
  const { query } = req.query;
  const locations = await searchLocation(query);

  res.json(locations);
});

app.get("*", (req, res) => {
  res.sendStatus(404);
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});
