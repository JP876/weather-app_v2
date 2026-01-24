import express from "express";
import morgan from "morgan";
import { join } from "path";
import { createReadStream } from "fs";
import csvParser from "csv-parser";
import NodeCache from "node-cache";
import { rateLimit } from "express-rate-limit";
import { slowDown } from "express-slow-down";
import dotenv from "dotenv";
import helmet from "helmet";

import type { CityType } from "./types";

dotenv.config({ path: join(__dirname, "../../..", ".env") });

const app = express();
const cacheInstance = new NodeCache();

const rateLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    limit: 50,
    standardHeaders: "draft-6",
    legacyHeaders: false,
    ipv6Subnet: 64,
});

const slowDownLimiter = slowDown({
    windowMs: 30 * 60 * 1000,
    delayAfter: 50,
    delayMs: (hits) => hits * 500,
});

const port = process.env.PORT || 5000;

app.use(morgan("dev"));
app.use(helmet());

app.use(express.static(join(__dirname, "../..", "client", "dist/")));

app.get("/:id", (req, res) => {
    const path = join(__dirname, "../..", "client", "dist/");
    res.sendFile(path);
});

app.get("/api/v1/worldcities", rateLimiter, slowDownLimiter, (req, res) => {
    const results: CityType[] = [];

    if (cacheInstance.has(`worldcities`)) {
        return res.json({ results: cacheInstance.get("worldcities") });
    }

    createReadStream(join(__dirname, "../", "worldcities.csv"))
        .pipe(csvParser())
        .on("data", (data) => results.push(data))
        .on("end", () => {
            cacheInstance.set(`worldcities`, results, 60 * 60 * 24);
            res.json({ results });
        })
        .on("error", () => {
            res.status(500).send("Failed to parse world cities data");
        });
});

app.get("/api/v1/weather-forecast", rateLimiter, slowDownLimiter, async (req, res) => {
    const URL = process.env.OPEN_WEATHER_30_API_BASE_URL;
    const API_KEY = process.env.OPEN_WEATHER_API_KEY;

    try {
        if (!req.query?.lat || !req.query?.lng) {
            return res
                .status(404)
                .send(
                    "You must include city coordinates in the request, formatted as lat and lng.",
                );
        }

        const { lat, lng } = req.query;

        if (cacheInstance.has(`weather_data-${lat}/${lng}`)) {
            return res.json({ results: cacheInstance.get(`weather_data-${lat}/${lng}`) });
        }

        const response = await fetch(`${URL}?lat=${lat}&lon=${lng}&appid=${API_KEY}&units=metric`);

        if (!response.ok) {
            return res.status(404).send("Failed to fetch weather forecast");
        }

        const data = await response.json();
        cacheInstance.set(`weather_data-${lat}/${lng}`, data, 60 * 10);

        res.json({ results: data });
    } catch (error) {
        res.status(500).send("Failed to fetch weather forecast data");
    }
});

app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});
