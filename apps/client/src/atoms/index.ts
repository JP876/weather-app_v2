import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

import type { CityType, UserSettingsType } from "../types";
import type { WeatherDataType } from "../types/weatherdata";

type FetchInfoType<T> = {
    data: T | null;
    isLoading: boolean;
    error: boolean | { msg: string };
};

const initialFetchInfo = { data: null, isLoading: false, error: false };

export const citiesFetchInfoAtom = atom<FetchInfoType<CityType[]>>(initialFetchInfo);
export const weatherFetchInfoAtom = atom<FetchInfoType<WeatherDataType>>(initialFetchInfo);

export const searchValueAtom = atom("");
export const filteredCitiesAtom = atom<CityType[] | null>(null);
export const favouriteCitiesAtom = atomWithStorage<CityType[]>("favouriteCities", []);

export const userSettingsAtom = atomWithStorage<UserSettingsType>("settings", {
    daily: { list: true, graph: true },
    hourly: { cards: true, graph: true },
});
