import { useCallback, useMemo, useRef } from "react";
import { useSetAtom } from "jotai";
import type { DexieError } from "dexie";

import type { CityType } from "../../../../types";
import { weatherFetchInfoAtom } from "../../../../atoms";
import type { WeatherDataType } from "../../../../types/weatherdata";
import { db } from "../../../../utils/db";
import type { FetchInfoError, UnitsType } from "../../../../atoms/types";
import withFetch, { type WithFetchErrors } from "../../../../utils/withFetch";
import withCatch from "../../../../utils/withCatch";
import { REFETCH_LIMIT } from "../../../../consts";

type GetWeatherDataFromDBOptions = {
    cityId: number;
};

type FetchWeatherDataOptions = {
    lat: string;
    lng: string;
    units: UnitsType;
};

type UpdateWeatherDataDBOptions = {
    hasData: boolean;
    cityId: number;
    weatherData: WeatherDataType;
};

type FetchParamsType = { units: UnitsType } & Pick<CityType, "id" | "lat" | "lng">;

const useFetchWeatherData = () => {
    const refetchInfo = useRef<{ count: number; cityId: null | number }>({
        count: 0,
        cityId: null,
    });
    const setWeatherFetchInfo = useSetAtom(weatherFetchInfoAtom);

    const getWeatherDataFromDB = useCallback(
        async ({
            cityId,
        }: GetWeatherDataFromDBOptions): Promise<[DexieError, boolean] | [null, boolean]> => {
            let hasData = false;
            const [error, results] = await withCatch<WeatherDataType[], DexieError>(
                db.weatherData.where("id").equals(cityId).toArray(),
            );

            if (error) return [error, hasData];

            hasData = Array.isArray(results) && results.length === 1;

            if (hasData) {
                setWeatherFetchInfo({ data: results[0], isLoading: false, error: false });
            } else {
                setWeatherFetchInfo({ data: null, isLoading: "INITIAL", error: false });
            }

            return [null, hasData];
        },
        [setWeatherFetchInfo],
    );

    const fetchWeatherData = useCallback(
        async (
            info: FetchWeatherDataOptions,
        ): Promise<[null, WeatherDataType] | [WithFetchErrors, null]> => {
            const [error, res] = await withFetch(
                `/api/v1/weather-forecast?lat=${info.lat}&lng=${info.lng}&units=${info.units}`,
                {},
                { delay: 500 },
            );

            if (error) return [error, null];

            const data = (await res.json()) as { results: WeatherDataType };
            return [null, data.results];
        },
        [],
    );

    const updateWeatherDataDB = useCallback(
        async ({
            hasData,
            cityId,
            weatherData,
        }: UpdateWeatherDataDBOptions): Promise<[DexieError | null]> => {
            let error = null;
            if (hasData) {
                [error] = await withCatch<number, DexieError>(
                    db.weatherData.update(cityId, weatherData),
                );
            } else {
                [error] = await withCatch<number, DexieError>(
                    db.weatherData.add({ ...weatherData, id: cityId }),
                );
            }
            return [error];
        },
        [],
    );

    const handleRefetch = useCallback(
        async ({
            units,
            ...cityInfo
        }: FetchParamsType): Promise<[FetchInfoError, null] | [null, WeatherDataType]> => {
            const cityId = +cityInfo.id;

            if (refetchInfo.current.cityId !== cityId) {
                refetchInfo.current = { cityId, count: 1 };
            } else {
                refetchInfo.current = {
                    cityId: refetchInfo.current.cityId,
                    count: ++refetchInfo.current.count,
                };

                if (refetchInfo.current.count === REFETCH_LIMIT) {
                    const error: FetchInfoError = {
                        type: "REFETCH_LIMIT_REACHED",
                        msg: "Too many refreshes for now. Give it a moment and retry.",
                    };
                    setWeatherFetchInfo((prevState) => ({ ...prevState, error }));
                    return [error, null];
                }
            }

            setWeatherFetchInfo((prevState) => ({ ...prevState, isLoading: "REFETCH" }));

            const [err, weatherData] = await fetchWeatherData({
                lat: cityInfo.lat.toString(),
                lng: cityInfo.lng.toString(),
                units,
            });

            if (err) {
                const error: FetchInfoError = {
                    type: "API_ERROR_WITH_DB_DATA",
                    msg: err.error.message,
                    cause: err.error.cause,
                };
                setWeatherFetchInfo((prevValue) => ({ ...prevValue, isLoading: false, error }));
                return [error, null];
            }

            setWeatherFetchInfo({ error: false, isLoading: false, data: weatherData });
            await withCatch<number, DexieError>(db.weatherData.update(cityId, weatherData));

            return [null, weatherData];
        },
        [fetchWeatherData, setWeatherFetchInfo],
    );

    const handleFetch = useCallback(
        async ({
            units,
            ...cityInfo
        }: FetchParamsType): Promise<[FetchInfoError, null] | [null, WeatherDataType]> => {
            const cityId = +cityInfo.id;

            const [, hasData] = await getWeatherDataFromDB({ cityId });
            const [err, weatherData] = await fetchWeatherData({
                lat: cityInfo.lat.toString(),
                lng: cityInfo.lng.toString(),
                units,
            });

            if (err) {
                const error: FetchInfoError = {
                    msg: err.error.message,
                    type: err.type,
                    cause: err.error.cause,
                };

                if (hasData) error.type = "API_ERROR_WITH_DB_DATA";

                setWeatherFetchInfo((prevValue) => ({ ...prevValue, isLoading: false, error }));
                return [error, null];
            }

            setWeatherFetchInfo({ error: false, isLoading: false, data: weatherData });
            await updateWeatherDataDB({ hasData, cityId, weatherData });

            return [null, weatherData];
        },
        [fetchWeatherData, getWeatherDataFromDB, setWeatherFetchInfo, updateWeatherDataDB],
    );

    return useMemo(() => ({ handleFetch, handleRefetch }), [handleFetch, handleRefetch]);
};

export default useFetchWeatherData;
