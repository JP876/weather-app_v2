import express from "express";
import morgan from "morgan";
import { join } from "path";
import { createReadStream } from "fs";
import csvParser from "csv-parser";

import type { CityType } from "./types";

const app = express();

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

app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});
