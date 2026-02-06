import { memo } from "react";
import { Box, styled, type BoxProps } from "@mui/material";
import { useAtomValue } from "jotai";

import CitiesNavigation from "./CitiesNavigation";
import RouterMain from "./Router";
import { citiesFetchInfoAtom, weatherFetchInfoAtom } from "../../atoms";

const MARGIN_BLOCK = 4;
const MARGIN_INLINE = 4;

const WeatherForecastContainer = styled(Box)(({ theme }) => ({
    position: "absolute",
    top: `calc(${theme.spacing(MARGIN_BLOCK)} + var(--header_height))`,
    left: theme.spacing(MARGIN_INLINE),
    zIndex: theme.zIndex.appBar,
    width: "36vw",
    border: `1px solid ${theme.palette.grey[400]}`,
    borderRadius: theme.shape.borderRadius,

    [theme.breakpoints.down("xl")]: {
        width: "42vw",
    },
    [theme.breakpoints.down("lg")]: {
        width: "48vw",
    },
    [theme.breakpoints.down("md")]: {
        width: `calc(100vw - 2 * ${theme.spacing(MARGIN_INLINE)})`,
    },
}));

const WeatherForecastRoutesContainer = styled(Box, {
    shouldForwardProp: (prop) => prop !== "isLoading",
})<BoxProps<"div", { isLoading: boolean }>>(({ theme, isLoading }) => ({
    // 100vh - 2 * top/bottom main "margin" - header height - tabs height - footer height
    "--weather-forecast-routes-container-height": `
        calc(100vh - 2 * ${theme.spacing(MARGIN_BLOCK)} - var(--header_height) - 3rem  - var(--footer_height))
    `,
    maxHeight: "var(--weather-forecast-routes-container-height)",
    overflow: "auto",
    position: "relative",

    ...(isLoading && {
        overflow: "hidden",
        pointerEvents: "none",
    }),
}));

const WeatherForecastHeight = styled(Box)(({ theme }) => ({
    visibility: "hidden",
    position: "absolute",
    top: 0,
    left: 0,
    height: `calc(100vh - 2 * ${theme.spacing(MARGIN_BLOCK)})`,
    "--weather-forecast-container-height": `calc(100vh - 2 * ${theme.spacing(MARGIN_BLOCK)})`,
}));

const RoutesContainer = ({ children }: { children: React.ReactNode }) => {
    const weatherFetchInfo = useAtomValue(weatherFetchInfoAtom);
    const citiesFetchInfo = useAtomValue(citiesFetchInfoAtom);

    return (
        <WeatherForecastRoutesContainer
            id="forecast-routes-container"
            isLoading={
                weatherFetchInfo.isLoading ||
                !!weatherFetchInfo.error ||
                citiesFetchInfo.isLoading ||
                !!citiesFetchInfo.error
            }
        >
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
