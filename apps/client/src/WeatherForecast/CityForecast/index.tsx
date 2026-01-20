import { useEffect } from "react";
import { Divider, Stack } from "@mui/material";
import { useSetAtom } from "jotai";

import { weatherDataAtom } from "../../atoms";
import type { WeatherDataType } from "../../types";
import useCityInfo from "./hooks/useCityInfo";
import CurrentMain from "./Current";
import DailyMain from "./Daily";

const CityForecastMain = () => {
    const setWeatherData = useSetAtom(weatherDataAtom);
    const cityInfo = useCityInfo();

    useEffect(() => {
        if (cityInfo) {
            fetch(`/api/v1/weather-forecast?lat=${cityInfo.lat}&lng=${cityInfo.lng}`)
                .then(async (res) => {
                    const data = (await res.json()) as { results: WeatherDataType };
                    setWeatherData(data.results);
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    }, [cityInfo, setWeatherData]);

    return (
        <Stack gap={2} px={2}>
            <CurrentMain />
            <Divider />
            <DailyMain />
        </Stack>
    );
};

export default CityForecastMain;
