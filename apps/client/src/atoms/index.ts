import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

import type { CityType, UserSettingsType } from "../types";
import type { WeatherDataType } from "../types/weatherdata";

export const citiesAtom = atom<CityType[] | null>(null);
export const filteredCitiesAtom = atom<CityType[] | null>(null);
export const searchValue = atom("");

export const favouriteCitiesAtom = atomWithStorage<CityType[]>("favouriteCities", []);

export const weatherDataAtom = atom<WeatherDataType | null>(null);
export const isLoadingWeatherDataAtom = atom(false);
export const errorWeatherData = atom(false);

export const userSettingsAtom = atomWithStorage<UserSettingsType>("settings", {
    daily: { list: true, graph: true },
});
