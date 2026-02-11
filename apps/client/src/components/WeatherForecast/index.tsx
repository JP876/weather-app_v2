import { memo } from "react";
import { Box, styled, type BoxProps } from "@mui/material";

import CitiesNavigation from "./CitiesNavigation";
import RouterMain from "../Router";
import { GlassContainer } from "../ui/styledComps";

const MARGIN_BLOCK = 4;
const MARGIN_INLINE = 4;
const CONTAINER_PADDING = 1;

const WeatherForecastContainer = styled(GlassContainer)(({ theme }) => ({
    position: "absolute",
    top: `calc(${theme.spacing(MARGIN_BLOCK)} + var(--header_height))`,
    left: theme.spacing(MARGIN_INLINE),
    zIndex: theme.zIndex.appBar,
    width: "40vw",
    border: `1px solid ${theme.palette.grey[400]}`,
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(CONTAINER_PADDING),

    [theme.breakpoints.down("xl")]: {
        width: "46vw",
    },
    [theme.breakpoints.down("lg")]: {
        width: "52vw",
    },
    [theme.breakpoints.down("md")]: {
        width: `calc(100vw - 2 * ${theme.spacing(MARGIN_INLINE)})`,
    },
}));

const WeatherForecastRoutesContainer = styled(Box)<BoxProps<"div">>(({ theme }) => ({
    // 100vh - 2 * top/bottom main "margin" - container padding - header height - tabs height - footer height
    "--routes-container-height": `
        calc(100vh - 
            2 * ${theme.spacing(MARGIN_BLOCK)} - 
            2 * ${theme.spacing(CONTAINER_PADDING)} - 
            var(--header_height) - 
            3rem  - 
            var(--footer_height))
    `,
    maxHeight: "var(--routes-container-height)",
    position: "relative",
    overflow: "hidden",
    pointerEvents: "none",
    scrollbarColor: `${theme.palette.primary.light} rgba(255, 255, 255, 0.0)`,
    scrollbarWidth: "thin",
}));

const WeatherForecastHeight = styled(Box)(({ theme }) => ({
    visibility: "hidden",
    position: "absolute",
    top: 0,
    left: 0,
    height: `calc(100vh - 2 * ${theme.spacing(MARGIN_BLOCK)})`,
    "--weather-forecast-container-height": `calc(100vh - 2 * ${theme.spacing(MARGIN_BLOCK)})`,
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
