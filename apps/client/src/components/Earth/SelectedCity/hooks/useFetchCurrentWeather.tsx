import { useCallback, useState } from "react";

import type { FetchInfoType } from "../../../../atoms/types";
import type { CurrentWeatherDataType } from "../../../../types/weatherdata";
import withFetch from "../../../../utils/withFetch";
import useMeasurementUnits from "../../../../hooks/useMeasurementUnits";

const useFetchCurrentWeather = () => {
    const [fetchWeatherInfo, setFetchWeatherInfo] = useState<FetchInfoType<CurrentWeatherDataType>>(
        { data: null, isLoading: false, error: false },
    );
    const units = useMeasurementUnits();

    const handleFetch = useCallback(
        async ({ lat, lng }: { lat: string; lng: string }) => {
            setFetchWeatherInfo((prevValue) => ({
                ...prevValue,
                error: false,
                isLoading: "INITIAL",
            }));

            const [err, res] = await withFetch(
                `/api/v1/current-weather?lat=${lat}&lng=${lng}&units=${units.units}`,
                {},
                { delay: 500 },
            );

            if (err) {
                const { error, type } = err;
                setFetchWeatherInfo({
                    data: null,
                    isLoading: false,
                    error: { type, msg: error.message, cause: error.cause },
                });
                return null;
            }

            const data = (await res.json()) as { results: CurrentWeatherDataType };
            setFetchWeatherInfo({ data: data.results, isLoading: false, error: false });
        },
        [units],
    );

    return { handleFetch, ...fetchWeatherInfo };
};

export default useFetchCurrentWeather;
