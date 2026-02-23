import { lazy, memo, Suspense } from "react";
import { Box, styled, type BoxProps } from "@mui/material";

import RouterMain from "../Router";
import { GlassContainer } from "../ui/styledComps";
import { CONTAINER_PADDING, NUM_OF_COLUMNS } from "../../consts";

const CitiesNavigation = lazy(() => import("./CitiesNavigation"));

const WeatherForecastContainer = styled(GlassContainer)(({ theme }) => ({
    gridRowStart: 2,
    gridColumnStart: 1,
    gridColumnEnd: 7,
    zIndex: 1,

    marginInline: theme.spacing(4),
    border: `1px solid ${theme.palette.grey[400]}`,
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(CONTAINER_PADDING),

    [theme.breakpoints.down("xl")]: {
        gridColumnEnd: 8,
    },
    [theme.breakpoints.down("lg")]: {
        gridColumnEnd: 9,
    },
    [theme.breakpoints.down("md")]: {
        gridColumnEnd: NUM_OF_COLUMNS + 1,
    },
}));

const WeatherForecastRoutesContainer = styled(Box)<BoxProps<"div">>(() => ({
    position: "relative",
    overflow: "hidden",
    height: `calc(100% - 48px)`,
    width: "100%",
}));

const WeatherForecast = () => {
    return (
        <WeatherForecastContainer id="wether-forecast-container-height">
            <Suspense fallback={null}>
                <CitiesNavigation />
            </Suspense>
            <WeatherForecastRoutesContainer id="forecast-routes-container">
                <RouterMain />
            </WeatherForecastRoutesContainer>
        </WeatherForecastContainer>
    );
};

export default memo(WeatherForecast);
