import express from "express";
import morgan from "morgan";
import { join } from "path";
import { createReadStream } from "fs";
import csvParser from "csv-parser";
import NodeCache from "node-cache";

import type { CityType } from "./types";

const app = express();
const cacheInstance = new NodeCache();

const port = process.env.PORT || 5000;

app.use(morgan("dev"));
app.use(express.static(join(__dirname, "../..", "client", "dist")));

app.get("/api/v1/worldcities", (req, res) => {
    const results: CityType[] = [];

    createReadStream(join(__dirname, "worldcities.csv"))
        .pipe(csvParser())
        .on("data", (data) => results.push(data))
        .on("end", () => {
            res.json({ results });
        })
        .on("error", () => {
            res.send("Failed to parse world cities data").status(500);
        });
});

app.get("/api/v1/weather-forecast", async (req, res) => {
    const URL = process.env.OPEN_WEATHER_30_API_BASE_URL;
    const API_KEY = process.env.OPEN_WEATHER_API_KEY;

    try {
        if (!req.query?.lat || !req.query?.lng) {
            return res
                .send("You must include city coordinates in the request, formatted as lat and lng.")
                .status(404);
        }

        const { lat, lng } = req.query;

        if (cacheInstance.has(`weather_data-${lat}/${lng}`)) {
            return res.json({ results: cacheInstance.get(`weather_data-${lat}/${lng}`) });
        }

        const response = await fetch(`${URL}?lat=${lat}&lon=${lng}&appid=${API_KEY}&units=metric`);

        if (!response.ok) {
            return res.send("Failed to fetch weather forecast").status(response.status);
        }

        const data = await response.json();
        cacheInstance.set(`weather_data-${lat}/${lng}`, data, 60 * 20);

        res.json({ results: data });
    } catch (error) {
        res.send("Failed to fetch weather forecast data").status(500);
    }
});

app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});
