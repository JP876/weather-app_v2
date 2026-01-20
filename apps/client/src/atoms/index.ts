import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

import type { CityType, WeatherDataType } from "../types";

export const citiesAtom = atom<CityType[] | null>(null);
export const searchValue = atom("");
export const favouriteCitiesAtom = atomWithStorage<CityType[]>("favouriteCities", []);
export const weatherDataAtom = atom<WeatherDataType | null>(null);
