import { useEffect } from "react";
import { Divider, Stack, styled, type StackProps } from "@mui/material";
import { useAtomValue, useSetAtom } from "jotai";

import { weatherFetchInfoAtom } from "../../atoms";
import useCityInfo from "./hooks/useCityInfo";
import CurrentMain from "./Current";
import DailyMain from "./Daily";
import type { WeatherDataType } from "../../types/weatherdata";
import HourlyMain from "./Hourly";
import FeadbackMain from "../../components/Feedback";

const CityForecastContainer = styled(Stack)<StackProps>(({ theme }) => ({
    gap: theme.spacing(2),
    position: "relative",
    paddingInline: theme.spacing(2),
}));

const FetchFeadbackMain = () => {
    const { isLoading, error } = useAtomValue(weatherFetchInfoAtom);
    return <FeadbackMain isLoading={isLoading} error={!!error} />;
};

const CityForecastMain = () => {
    const setWeatherFetchInfo = useSetAtom(weatherFetchInfoAtom);

    const cityInfo = useCityInfo();

    useEffect(() => {
        if (cityInfo) {
            setWeatherFetchInfo((prevInfo) => ({ ...prevInfo, error: false, isLoading: true }));

            Promise.all([
                fetch(`/api/v1/weather-forecast?lat=${cityInfo.lat}&lng=${cityInfo.lng}`),
                new Promise((res) => setTimeout(res, 1_000)), // min loading time
            ])
                .then(async ([res]) => {
                    if (!res.ok) {
                        throw new Error("Failed to fetch weather data");
                    }
                    const data = (await res.json()) as { results: WeatherDataType };
                    setWeatherFetchInfo({ data: data.results, error: false, isLoading: false });
                })
                .catch((err: unknown) => {
                    const error = err as Error;
                    setWeatherFetchInfo({
                        data: null,
                        error: { msg: error.message },
                        isLoading: false,
                    });
                });
        }
    }, [cityInfo, setWeatherFetchInfo]);

    return (
        <CityForecastContainer>
            <FetchFeadbackMain />
            <CurrentMain />
            <Divider />
            <HourlyMain />
            <Divider />
            <DailyMain />
        </CityForecastContainer>
    );
};

export default CityForecastMain;
