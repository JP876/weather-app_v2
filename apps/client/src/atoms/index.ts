import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

import type { CityType, UserSettingsType } from "../types";
import type { WeatherDataType } from "../types/weatherdata";

export const citiesFetchInfoAtom = atom<{
    data: CityType[] | null;
    isLoading: boolean;
    error: boolean;
}>({ data: null, isLoading: false, error: false });

export const filteredCitiesAtom = atom<CityType[] | null>(null);
export const searchValueAtom = atom("");

export const favouriteCitiesAtom = atomWithStorage<CityType[]>("favouriteCities", []);
export const weatherFetchInfoAtom = atom<{
    data: WeatherDataType | null;
    isLoading: boolean;
    error: boolean;
}>({ data: null, isLoading: false, error: false });

export const userSettingsAtom = atomWithStorage<UserSettingsType>("settings", {
    daily: { list: true, graph: true },
    hourly: { cards: true, graph: true },
});
