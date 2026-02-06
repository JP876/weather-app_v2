import Dexie, { type Table } from "dexie";

import type { CityType } from "../types";
import type { WeatherDataType } from "../types/weatherdata";

type WeatherDataDB = WeatherDataType & { id: number };

export class WeatherSphereDB extends Dexie {
    cities!: Table<CityType, number>;
    weatherData!: Table<WeatherDataDB, number>;

    constructor() {
        super("WeatherSphereDB");
        this.version(2).stores({
            cities: "id, population, city, city_ascii, country",
            weatherData: "id",
        });
    }
}

export const db = new WeatherSphereDB();
