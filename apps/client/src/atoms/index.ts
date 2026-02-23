import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import type { Vector3 } from "three";
import Fuse from "fuse.js";

import type { CityType } from "../types";
import type { WeatherDataType } from "../types/weatherdata";
import * as Types from "./types";

const initialFetchInfo = { data: null, isLoading: false, error: false };

export const citiesFetchInfoAtom = atom<Types.FetchInfoType<CityType[]>>(initialFetchInfo);
export const weatherFetchInfoAtom = atom<Types.FetchInfoType<WeatherDataType>>(initialFetchInfo);
export const earthFetchInfoAtom = atom<Types.FetchInfoType<string>>(initialFetchInfo);

export const searchValueAtom = atom("");

let fuse: Fuse<CityType> | null = null;

const setFuse = (data: CityType[]) => {
    return new Fuse<CityType>(data, {
        includeScore: true,
        includeMatches: true,
        threshold: 0.5,
        keys: [
            { name: "city", weight: 1 },
            { name: "country", weight: 0.8 },
        ],
    });
};

export const filteredCitiesAtom = atom((get) => {
    const value = get(searchValueAtom);
    const cities = get(citiesFetchInfoAtom).data;

    if (!Array.isArray(cities)) return null;
    if (value === "") return cities;

    if (fuse === null) fuse = setFuse(cities);

    return fuse
        .search({ $or: [{ city: value }, { country: value }] })
        .map((el) => ({ ...el.item }));
});

export const favouriteCitiesAtom = atomWithStorage<CityType[] | null>("favouriteCities", null);

export const snackbarAtom = atom<Types.SnackbarAtomType>({ open: false, message: "" });

export const initialCityDescription: Types.CityItemType = {
    flag: "show",
    isCapital: "show",
    topLeft: "city",
    topRight: "coordinates",
    bottomLeft: "country",
    bottomRight: "localtime",
};

const generalSettings: Types.GeneralSettingsType = {
    units: "metric",
    dateFormat: "HH:mm:ss dd/MMM/yyyy",
    leftClick: "add",
    middleClick: "navigate",
    cityItem: initialCityDescription,
};

export const userSettingsAtom = atomWithStorage<Types.UserSettingsType>("settings", {
    daily: { list: true, graph: true },
    hourly: { cards: true, graph: true },
    ...generalSettings,
});

export const selectedCityAtom = atom<(CityType & { position: Vector3 }) | null>(null);
export const citiesByCountry = atom<CityType[] | null>(null);

export const openSettingsAtom = atom(false);
export const generalSettingAtom = atom<Types.GeneralSettingsType>(generalSettings);
