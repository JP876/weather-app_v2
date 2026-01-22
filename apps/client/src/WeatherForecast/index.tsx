import { memo } from "react";
import { Box, Paper, styled, type BoxProps, type PaperProps } from "@mui/material";
import { useAtomValue } from "jotai";

import CitiesNavigation from "./CitiesNavigation";
import RouterMain from "./Router";
import { weatherFetchInfoAtom } from "../atoms";

const MAIN_MARGIN = 4;

const WeatherForecastContainer = styled(Paper)<PaperProps>(({ theme }) => ({
    position: "absolute",
    top: theme.spacing(MAIN_MARGIN),
    left: theme.spacing(MAIN_MARGIN),
    zIndex: theme.zIndex.appBar,
    width: "36vw",

    [theme.breakpoints.down("xl")]: {
        width: "42vw",
    },
    [theme.breakpoints.down("lg")]: {
        width: "48vw",
    },
    [theme.breakpoints.down("md")]: {
        width: `calc(100vw - 2 * ${theme.spacing(MAIN_MARGIN)})`,
    },
}));

const WeatherForecastRoutesContainer = styled(Box, {
    shouldForwardProp: (prop) => prop !== "isLoading",
})<BoxProps & { isLoading: boolean }>(({ theme, isLoading }) => ({
    // 100vh - 2 * top/bottom main "margin" - tabs height
    maxHeight: `calc(100vh - 2 * ${theme.spacing(MAIN_MARGIN)} - 3rem)`,
    "--weather-forecast-routes-container-height": `calc(100vh - 2 * ${theme.spacing(MAIN_MARGIN)} - 3rem)`,
    overflow: "auto",
    position: "relative",

    ...(isLoading && {
        overflow: "hidden",
        pointerEvents: "none",
    }),
}));

const WeatherForecastHeight = styled(Box)<BoxProps>(({ theme }) => ({
    visibility: "hidden",
    position: "absolute",
    top: 0,
    left: 0,
    height: `calc(100vh - 2 * ${theme.spacing(MAIN_MARGIN)})`,
    "--weather-forecast-container-height": `calc(100vh - 2 * ${theme.spacing(MAIN_MARGIN)})`,
}));

const RoutesContainer = ({ children }: { children: React.ReactNode }) => {
    const { isLoading } = useAtomValue(weatherFetchInfoAtom);
    return (
        <WeatherForecastRoutesContainer id="forecast-routes-container" isLoading={isLoading}>
            {children}
        </WeatherForecastRoutesContainer>
    );
};

const WeatherForecast = () => {
    return (
        <WeatherForecastContainer>
            <WeatherForecastHeight id="wether-forecast-container-height" />
            <CitiesNavigation />
            <RoutesContainer>
                <RouterMain />
            </RoutesContainer>
        </WeatherForecastContainer>
    );
};

export default memo(WeatherForecast);
