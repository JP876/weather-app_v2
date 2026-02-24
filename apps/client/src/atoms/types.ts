import type { AlertProps, SnackbarProps } from "@mui/material";

export type FetchInfoErrorTypes =
    | "NETWORK_ERROR"
    | "API_ERROR"
    | "INDEXED_DB_ERROR"
    | "API_ERROR_WITH_DB_DATA"
    | "REFETCH_LIMIT_REACHED";

export type FetchInfoLoadingTypes = "INITIAL" | "REFETCH";

export type FetchInfoError = {
    msg: string;
    type: FetchInfoErrorTypes;
    cause?: unknown;
};

export type FetchInfoType<T> =
    | { data: null; isLoading: false; error: false }
    | { data: T; isLoading: false; error: false }
    | { data: T | null; isLoading: false; error: FetchInfoError }
    | { data: T | null; isLoading: FetchInfoLoadingTypes; error: FetchInfoError | false };

export type AlertPropsType = Pick<AlertProps, "severity" | "variant">;
export type SnackbarPropsType = Pick<SnackbarProps, "autoHideDuration" | "open">;

export type SnackbarAtomType = {
    message: string;
} & AlertPropsType &
    SnackbarPropsType;

export type ThemeModeType = "dark" | "system" | "light";
export type MouseClickActionType = "add" | "navigate";
export type UnitsType = "metric" | "imperial";

export type CityDescriptionOptions =
    | "city"
    | "cityiso2"
    | "countryiso2"
    | "country"
    | "coordinates"
    | "localtime"
    | "none";

export type CityItemType = {
    flag: "show" | "hide";
    isCapital: "show" | "hide";
    topLeft: CityDescriptionOptions;
    topRight: CityDescriptionOptions;
    bottomLeft: CityDescriptionOptions;
    bottomRight: CityDescriptionOptions;
};

export type GeneralSettingsType = {
    units: UnitsType;
    dateFormat: string;
    leftClick: MouseClickActionType;
    middleClick: MouseClickActionType;
    cityItem: CityItemType;
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
