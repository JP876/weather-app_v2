import { useEffect } from "react";
import {
    Box,
    CircularProgress,
    Divider,
    Stack,
    styled,
    type BoxProps,
    type StackProps,
} from "@mui/material";
import { useAtomValue, useSetAtom } from "jotai";

import { weatherFetchInfoAtom } from "../../atoms";
import useCityInfo from "./hooks/useCityInfo";
import CurrentMain from "./Current";
import DailyMain from "./Daily";
import type { WeatherDataType } from "../../types/weatherdata";
import HourlyMain from "./Hourly";

const CityForecastContainer = styled(Stack)<StackProps>(({ theme }) => ({
    gap: theme.spacing(2),
    position: "relative",
}));

const LoadingContainer = styled(Box, {
    shouldForwardProp: (prop) => prop !== "isLoading" && prop !== "top",
})<BoxProps & { isLoading: boolean; top?: number }>(({ theme, isLoading, top }) => ({
    position: "absolute",
    top: top,
    left: 0,
    width: "100%",
    height: "var(--weather-forecast-routes-container-height)",
    backgroundColor: theme.alpha(theme.palette.grey[200], 0.4),
    zIndex: theme.zIndex.drawer + 1,
    display: isLoading ? "flex" : "none",
    justifyContent: "center",
    alignItems: "center",
}));

const LoadingWeatherData = () => {
    const { isLoading } = useAtomValue(weatherFetchInfoAtom);
    const container = document.getElementById("forecast-routes-container");

    return (
        <LoadingContainer isLoading={isLoading} top={container?.scrollTop}>
            <CircularProgress size={64} thickness={3} />
        </LoadingContainer>
    );
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
                .catch((error) => {
                    console.error(error);
                    setWeatherFetchInfo({ data: null, error: true, isLoading: false });
                });
        }
    }, [cityInfo, setWeatherFetchInfo]);

    return (
        <CityForecastContainer>
            <LoadingWeatherData />
            <CurrentMain />
            <Divider />
            <HourlyMain />
            <Divider />
            <DailyMain />
        </CityForecastContainer>
    );
};

export default CityForecastMain;
