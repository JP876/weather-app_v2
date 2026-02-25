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

const getWeatherDataFromDB = async ({
    cityId,
}: GetWeatherDataFromDBOptions): Promise<[DexieError, false] | [null, WeatherDataType]> => {
    const [error, results] = await withCatch<WeatherDataType[], DexieError>(
        db.weatherData.where("id").equals(cityId).toArray(),
    );

    if (error) return [error, false];
    return [null, results[0]];
};

const fetchWeatherData = async (
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
};

const updateWeatherDataDB = async ({
    hasData,
    cityId,
    weatherData,
}: UpdateWeatherDataDBOptions): Promise<[DexieError | null]> => {
    let error = null;
    if (hasData) {
        [error] = await withCatch<number, DexieError>(db.weatherData.update(cityId, weatherData));
    } else {
        [error] = await withCatch<number, DexieError>(
            db.weatherData.add({ ...weatherData, id: cityId }),
        );
    }
    return [error];
};

const useFetchWeatherData = () => {
    const refetchInfo = useRef<{ count: number; cityId: null | number }>({
        count: 0,
        cityId: null,
    });
    const setWeatherFetchInfo = useSetAtom(weatherFetchInfoAtom);

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
            const [, dataDB] = await getWeatherDataFromDB({ cityId });

            const [err, weatherData] = await fetchWeatherData({
                lat: cityInfo.lat.toString(),
                lng: cityInfo.lng.toString(),
                units,
            });

            if (err) {
                const type: FetchInfoError["type"] = dataDB
                    ? "API_ERROR_WITH_DB_DATA"
                    : "API_ERROR";
                const error: FetchInfoError = {
                    type,
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
        [setWeatherFetchInfo],
    );

    const handleFetch = useCallback(
        async ({
            units,
            ...cityInfo
        }: FetchParamsType): Promise<[FetchInfoError, null] | [null, WeatherDataType]> => {
            const cityId = +cityInfo.id;

            const [, dataDB] = await getWeatherDataFromDB({ cityId });

            if (dataDB) {
                setWeatherFetchInfo({ data: dataDB, isLoading: "REFRESH", error: false });
            } else {
                setWeatherFetchInfo({ data: null, isLoading: "INITIAL", error: false });
            }

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

                if (dataDB) error.type = "API_ERROR_WITH_DB_DATA";

                setWeatherFetchInfo((prevValue) => ({ ...prevValue, isLoading: false, error }));
                return [error, null];
            }

            setWeatherFetchInfo({ error: false, isLoading: false, data: weatherData });
            await updateWeatherDataDB({ hasData: !!dataDB, cityId, weatherData });

            return [null, weatherData];
        },
        [setWeatherFetchInfo],
    );

    return useMemo(() => ({ handleFetch, handleRefetch }), [handleFetch, handleRefetch]);
};

export default useFetchWeatherData;
