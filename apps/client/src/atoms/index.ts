import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

import type { CityType } from "../types";
import type { WeatherDataType } from "../types/weatherdata";
import * as Types from "./types";

const initialFetchInfo = { data: null, isLoading: false, error: false };

export const citiesFetchInfoAtom = atom<Types.FetchInfoType<CityType[]>>(initialFetchInfo);
export const weatherFetchInfoAtom = atom<Types.FetchInfoType<WeatherDataType>>(initialFetchInfo);
export const earthFetchInfoAtom = atom<Types.FetchInfoType<string>>(initialFetchInfo);

export const searchValueAtom = atom("");
export const filteredCitiesAtom = atom<CityType[] | null>(null);
export const favouriteCitiesAtom = atomWithStorage<CityType[] | null>("favouriteCities", null);

export const snackbarAtom = atom<Types.SnackbarAtomType>({ open: false, message: "" });

const generalSettings: Types.GeneralSettingsType = {
    units: "metric",
    dateFormat: "HH:mm:ss dd/MMM/yyyy",
    leftClick: "add",
    middleClick: "navigate",
};

export const userSettingsAtom = atomWithStorage<Types.UserSettingsType>("settings", {
    daily: { list: true, graph: true },
    hourly: { cards: true, graph: true },
    ...generalSettings,
});

export const selectedCityAtom = atom<CityType | null>(null);

export const openSettingsAtom = atom(false);
export const generalSettingAtom = atom<Types.GeneralSettingsType>(generalSettings);
