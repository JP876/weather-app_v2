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

import { errorWeatherData, isLoadingWeatherDataAtom, weatherDataAtom } from "../../atoms";
import useCityInfo from "./hooks/useCityInfo";
import CurrentMain from "./Current";
import DailyMain from "./Daily";
import type { WeatherDataType } from "../../types/weatherdata";

const CityForecastContainer = styled(Stack)<StackProps>(({ theme }) => ({
    gap: theme.spacing(2),
    paddingInline: theme.spacing(2),
    position: "relative",
    overflowY: "auto",
}));

type LoadingContainerProps = BoxProps & {
    isLoading: boolean;
};

const LoadingContainer = styled(Box, {
    shouldForwardProp: (prop) => prop !== "isLoading",
})<LoadingContainerProps>(({ theme, isLoading }) => ({
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: theme.alpha(theme.palette.grey[200], 0.4),
    zIndex: theme.zIndex.drawer + 1,
    display: isLoading ? "flex" : "none",
    justifyContent: "center",
    alignItems: "center",
}));

const LoadingWeatherData = () => {
    const isLoading = useAtomValue(isLoadingWeatherDataAtom);

    return (
        <LoadingContainer isLoading={isLoading}>
            <CircularProgress color="inherit" size={60} thickness={3} />
        </LoadingContainer>
    );
};

const CityForecastMain = () => {
    const setWeatherData = useSetAtom(weatherDataAtom);
    const setIsLoading = useSetAtom(isLoadingWeatherDataAtom);
    const setError = useSetAtom(errorWeatherData);

    const cityInfo = useCityInfo();

    useEffect(() => {
        if (cityInfo) {
            setIsLoading(true);

            Promise.all([
                fetch(`/api/v1/weather-forecast?lat=${cityInfo.lat}&lng=${cityInfo.lng}`),
                new Promise((res) => setTimeout(res, 1_000)), // min loading time
            ])
                .then(async ([res]) => {
                    if (!res.ok) {
                        throw new Error("Failed to fetch weather data");
                    }

                    const data = (await res.json()) as { results: WeatherDataType };

                    setError(false);
                    setWeatherData(data.results);
                })
                .catch((error) => {
                    console.error(error);

                    setError(true);
                    setWeatherData(null);
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }
    }, [cityInfo, setError, setIsLoading, setWeatherData]);

    return (
        <CityForecastContainer>
            <LoadingWeatherData />
            <CurrentMain />
            <Divider />
            <DailyMain />
        </CityForecastContainer>
    );
};

export default CityForecastMain;
