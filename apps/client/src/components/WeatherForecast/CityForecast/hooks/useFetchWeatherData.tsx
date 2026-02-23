import { useCallback, useMemo } from "react";
import { useSetAtom } from "jotai";
import type { DexieError } from "dexie";

import type { CityType } from "../../../../types";
import { weatherFetchInfoAtom } from "../../../../atoms";
import type { WeatherDataType } from "../../../../types/weatherdata";
import { db } from "../../../../utils/db";
import type { UnitsType } from "../../../../atoms/types";
import withFetch, { type WithFetchErrors } from "../../../../utils/withFetch";
import withCatch from "../../../../utils/withCatch";

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
                setWeatherFetchInfo((prevInfo) => ({
                    ...prevInfo,
                    error: false,
                    isLoading: true,
                }));
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
            setWeatherFetchInfo({ error: false, isLoading: false, data: data.results });

            return [null, data.results];
        },
        [setWeatherFetchInfo],
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

    const handleFetch = useCallback(
        async ({ units, ...cityInfo }: FetchParamsType) => {
            const cityId = +cityInfo.id;

            const [, hasData] = await getWeatherDataFromDB({ cityId });
            const [err, weatherData] = await fetchWeatherData({
                lat: cityInfo.lat.toString(),
                lng: cityInfo.lng.toString(),
                units,
            });

            if (err) {
                setWeatherFetchInfo((prevValue) => ({
                    ...prevValue,
                    isLoading: false,
                    error: { msg: err.error.message, type: err.type, cause: err.error.cause },
                }));
                return null;
            }

            await updateWeatherDataDB({ hasData, cityId, weatherData });
        },
        [fetchWeatherData, getWeatherDataFromDB, setWeatherFetchInfo, updateWeatherDataDB],
    );

    return useMemo(() => ({ handleFetch }), [handleFetch]);
};

export default useFetchWeatherData;
