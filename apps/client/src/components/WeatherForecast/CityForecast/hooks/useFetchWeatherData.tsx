import { useCallback, useMemo } from "react";
import { useSetAtom } from "jotai";

import type { CityType } from "../../../../types";
import { weatherFetchInfoAtom, type FetchInfoType } from "../../../../atoms";
import type { WeatherDataType } from "../../../../types/weatherdata";
import { db } from "../../../../utils/db";

type GetWeatherDataFromDBOptions = {
    cityId: number;
};

type FetchWeatherDataOptions = {
    lat: string;
    lng: string;
};

type UpdateWeatherDataDBOptions = {
    hasData: boolean;
    cityId: number;
    weatherData: WeatherDataType;
};

const useFetchWeatherData = () => {
    const setWeatherFetchInfo = useSetAtom(weatherFetchInfoAtom);

    const getWeatherDataFromDB = useCallback(
        async ({ cityId }: GetWeatherDataFromDBOptions) => {
            let hasData = false;

            try {
                const results = await db.weatherData.where("id").equals(cityId).toArray();
                hasData = Array.isArray(results) && results.length === 1;

                if (hasData) {
                    setWeatherFetchInfo({ data: results[0], isLoading: false, error: false });
                } else {
                    setWeatherFetchInfo((prevInfo) => ({
                        ...prevInfo,
                        error: false,
                        isLoading: true,
                    }));
                }

                return Promise.resolve({ hasData });
            } catch (err: unknown) {
                console.error(err);
                return Promise.resolve({ hasData });
            }
        },
        [setWeatherFetchInfo],
    );

    const fetchWeatherData = useCallback(
        async ({ lat, lng }: FetchWeatherDataOptions) => {
            try {
                const [res] = await Promise.all([
                    fetch(`/api/v1/weather-forecast?lat=${lat}&lng=${lng}`),
                    new Promise((resolve) => setTimeout(resolve, 500)),
                ]);

                if (!res.ok) {
                    throw new Error("Failed to fetch weather data");
                }

                const data = (await res.json()) as { results: WeatherDataType };
                setWeatherFetchInfo((prevInfo) => ({
                    ...prevInfo,
                    data: data.results,
                    isLoading: false,
                }));

                return Promise.resolve({ weatherData: data.results });
            } catch (err: unknown) {
                return Promise.reject(err);
            }
        },
        [setWeatherFetchInfo],
    );

    const updateWeatherDataDB = useCallback(
        async ({ hasData, cityId, weatherData }: UpdateWeatherDataDBOptions) => {
            try {
                if (hasData) {
                    await db.weatherData.update(cityId, weatherData);
                } else {
                    await db.weatherData.add({ ...weatherData, id: cityId });
                }
            } catch (err: unknown) {
                console.error(err);
            }
        },
        [],
    );

    const handleFetch = useCallback(
        async (cityInfo: Pick<CityType, "id" | "lat" | "lng">) => {
            try {
                const cityId = +cityInfo.id;

                const { hasData } = await getWeatherDataFromDB({ cityId });
                const { weatherData } = await fetchWeatherData({
                    lat: cityInfo.lat.toString(),
                    lng: cityInfo.lng.toString(),
                });

                if (weatherData) {
                    await updateWeatherDataDB({ hasData, cityId, weatherData });
                }
            } catch (err: unknown) {
                const error = err as Error;
                const fetchInfo: FetchInfoType<WeatherDataType> = {
                    data: null,
                    isLoading: false,
                    error: {
                        type: "API",
                        msg: error.message,
                        name: error.name,
                        cause: error.cause,
                    },
                };

                if (error.name === "AbortError") {
                    fetchInfo.error = false;
                }

                setWeatherFetchInfo(fetchInfo);
            }
        },
        [fetchWeatherData, getWeatherDataFromDB, setWeatherFetchInfo, updateWeatherDataDB],
    );

    return useMemo(() => ({ handleFetch }), [handleFetch]);
};

export default useFetchWeatherData;
