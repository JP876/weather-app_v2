import { useCallback, useMemo } from "react";
import { useSetAtom } from "jotai";

import type { CityType } from "../../../../types";
import { weatherFetchInfoAtom, type FetchInfoType } from "../../../../atoms";
import type { WeatherDataType } from "../../../../types/weatherdata";
import { db } from "../../../../utils/db";

const useFetchWeatherData = () => {
    const setWeatherFetchInfo = useSetAtom(weatherFetchInfoAtom);

    const handleFetch = useCallback(
        async (cityInfo: CityType) => {
            let weatherData: WeatherDataType | null = null;
            let hasData = false;

            try {
                const results = await db.weatherData.where("id").equals(+cityInfo.id).toArray();
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
            } catch (err: unknown) {
                console.error(err);
            }

            try {
                const res = await fetch(
                    `/api/v1/weather-forecast?lat=${cityInfo.lat}&lng=${cityInfo.lng}`,
                );

                if (!res.ok) {
                    throw new Error("Failed to fetch weather data");
                }

                const data = (await res.json()) as { results: WeatherDataType };
                weatherData = data.results;

                setWeatherFetchInfo((prevInfo) => ({
                    ...prevInfo,
                    data: weatherData,
                    isLoading: false,
                }));
            } catch (err: unknown) {
                const error = err as Error;
                const fetchInfo: FetchInfoType<WeatherDataType> = {
                    data: null,
                    isLoading: false,
                    error: { msg: error.message },
                };

                if (error.name === "AbortError") {
                    fetchInfo.error = false;
                }

                setWeatherFetchInfo(fetchInfo);
            }

            if (weatherData) {
                try {
                    if (hasData) {
                        await db.weatherData.update(+cityInfo.id, weatherData);
                    } else {
                        await db.weatherData.add({ ...weatherData, id: +cityInfo.id });
                    }
                } catch (err: unknown) {
                    console.error(err);
                }
            }
        },
        [setWeatherFetchInfo],
    );

    return useMemo(() => ({ handleFetch }), [handleFetch]);
};

export default useFetchWeatherData;
