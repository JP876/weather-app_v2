export type ColorableParts = {
    sun?: string;
    moon?: string;
    light_cloud?: string;
    cloud?: string;
    dark_cloud?: string;
    rain?: string;
    snow?: string;
    thunder?: string;
    wind?: string;
    leaf?: string;
    hail?: string;
    sleet?: string;
    fog?: string;
};

export type SkyconIconType =
    | "CLEAR_DAY"
    | "CLEAR_NIGHT"
    | "PARTLY_CLOUDY_DAY"
    | "PARTLY_CLOUDY_NIGHT"
    | "CLOUDY"
    | "RAIN"
    | "SHOWERS_DAY"
    | "SHOWERS_NIGHT"
    | "SLEET"
    | "RAIN_SNOW"
    | "RAIN_SNOW_SHOWERS_DAY"
    | "RAIN_SNOW_SHOWERS_NIGHT"
    | "SNOW"
    | "SNOW_SHOWERS_DAY"
    | "SNOW_SHOWERS_NIGHT"
    | "WIND"
    | "FOG"
    | "THUNDER"
    | "THUNDER_RAIN"
    | "THUNDER_SHOWERS_DAY"
    | "THUNDER_SHOWERS_NIGHT"
    | "HAIL";

export type SkyconProps = Omit<React.CanvasHTMLAttributes<HTMLCanvasElement>, "color"> & {
    icon: SkyconIconType;
    color?: string | ColorableParts;
    size?: number;
    animate?: boolean;
    resizeClear?: boolean;
    style?: React.CSSProperties;
    className?: string;
};
