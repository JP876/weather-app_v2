import { memo } from "react";
import { Box, Paper, styled, type BoxProps, type PaperProps } from "@mui/material";

import CitiesNavigation from "./CitiesNavigation";
import RouterMain from "./Router";

const MAIN_MARGIN = 4;

const WeatherForecastContainer = styled(Paper)<PaperProps>(({ theme }) => ({
    position: "absolute",
    top: theme.spacing(MAIN_MARGIN),
    left: theme.spacing(MAIN_MARGIN),
    zIndex: theme.zIndex.appBar,
    width: "36vw",
    "--weather-forecast-container-width": "36vw",
}));

const WeatherForecastRoutesContainer = styled(Box)<BoxProps>(({ theme }) => ({
    // 100vh - 2 * top/bottom main "margin" - tabs height
    maxHeight: `calc(100vh - 2 * ${theme.spacing(MAIN_MARGIN)} - 3rem)`,
    overflow: "auto",
    position: "relative",
}));

const WeatherForecastHeight = styled(Box)<BoxProps>(({ theme }) => ({
    visibility: "hidden",
    position: "absolute",
    top: 0,
    left: 0,
    height: `calc(100vh - 2 * ${theme.spacing(MAIN_MARGIN)})`,
}));

const WeatherForecast = () => {
    return (
        <WeatherForecastContainer>
            <WeatherForecastHeight id="wether-forecast-container-height" />
            <CitiesNavigation />
            <WeatherForecastRoutesContainer id="forecast-routes-container">
                <RouterMain />
            </WeatherForecastRoutesContainer>
        </WeatherForecastContainer>
    );
};

export default memo(WeatherForecast);
