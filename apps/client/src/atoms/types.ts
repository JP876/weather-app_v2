import type { AlertProps, SnackbarProps } from "@mui/material";

export type FetchInfoError = {
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

export type AlertPropsType = Pick<AlertProps, "severity" | "variant">;
export type SnackbarPropsType = Pick<SnackbarProps, "autoHideDuration" | "open">;

export type SnackbarAtomType = {
    message: string;
} & AlertPropsType &
    SnackbarPropsType;

export type ThemeModeType = "dark" | "system" | "light";
export type MouseClickActionType = "add" | "navigate";
export type UnitsType = "metric" | "imperial";

export type GeneralSettingsType = {
    units: UnitsType;
    dateFormat: string;
    leftClick: MouseClickActionType;
    middleClick: MouseClickActionType;
};

export type UserSettingsType = GeneralSettingsType & {
    daily: {
        list: boolean;
        graph: boolean;
    };
    hourly: {
        cards: boolean;
        graph: boolean;
    };
};
