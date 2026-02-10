import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

import type { CityType, UserSettingsType } from "../types";
import type { WeatherDataType } from "../types/weatherdata";
import type { AlertProps, SnackbarProps } from "@mui/material";

type FetchInfoError = {
    msg: string;
    type: "DB" | "API";
    name: string;
    cause?: unknown;
};

export type FetchInfoType<T> = {
    data: T | null;
    isLoading: boolean;
    error: boolean | FetchInfoError;
};

type AlertPropsType = Pick<AlertProps, "severity" | "variant">;
type SnackbarPropsType = Pick<SnackbarProps, "autoHideDuration" | "open">;

export type SnackbarAtomType = {
    message: string;
} & AlertPropsType &
    SnackbarPropsType;

const initialFetchInfo = { data: null, isLoading: false, error: false };

export const citiesFetchInfoAtom = atom<FetchInfoType<CityType[]>>(initialFetchInfo);
export const weatherFetchInfoAtom = atom<FetchInfoType<WeatherDataType>>(initialFetchInfo);
export const earthFetchInfoAtom = atom<FetchInfoType<string>>(initialFetchInfo);

export const searchValueAtom = atom("");
export const filteredCitiesAtom = atom<CityType[] | null>(null);
export const favouriteCitiesAtom = atomWithStorage<CityType[] | null>("favouriteCities", null);

export const snackbarAtom = atom<SnackbarAtomType>({ open: false, message: "" });

export const userSettingsAtom = atomWithStorage<UserSettingsType>("settings", {
    daily: { list: true, graph: true },
    hourly: { cards: true, graph: true },
});
