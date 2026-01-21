export type AlertType = {
    description: string;
    end: number;
    event: string;
    sender_name: string;
    start: number;
    tags: string[];
};

export type WeatherType = {
    description: string;
    icon: string;
    id: number;
    main: string;
};

export type FeelsLikeType = {
    day: number;
    night: number;
    eve: number;
    morn: number;
};

export type TempType = {
    day: number;
    eve: number;
    max: number;
    min: number;
    morn: number;
    night: number;
};

export type CurrentWeatherType = {
    clouds: number;
    dew_point: number;
    dt: number;
    feels_like: number;
    humidity: number;
    pressure: number;
    sunrise: number;
    sunset: number;
    temp: number;
    uvi: number;
    visibility: number;
    weather: WeatherType[];
    wind_deg: number;
    wind_speed: number;
};

export type DailyWeatherType = {
    dew_point: number;
    dt: number;
    feels_like: FeelsLikeType;
    humidity: number;
    moon_phase: number;
    moonrise: number;
    moonset: number;
    pop: number;
    pressure: number;
    rain: number;
    summary: string;
    sunrise: number;
    sunset: number;
    temp: TempType;
    uvi: number;
    weather: WeatherType[];
    wind_deg: number;
    wind_gust: number;
    wind_speed: number;
};

export type HourlyWeatherType = {
    clouds: number;
    dew_point: number;
    dt: number;
    feels_like: number;
    humidity: number;
    pop: number;
    pressure: number;
    temp: number;
    uvi: number;
    visibility: number;
    weather: WeatherType[];
    wind_deg: number;
    wind_gust: number;
    rain?: { ["1h"]: number };
};

export type WeatherDataType = {
    alerts: AlertType[];
    current: CurrentWeatherType;
    daily: DailyWeatherType[];
    hourly: HourlyWeatherType[];
    lat: number;
    lon: number;
    minutely: { dt: number; precipitation: number }[];
    timezone: string;
    timezone_offset: number;
};
