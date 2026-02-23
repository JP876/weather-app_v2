import { lazy, Suspense, useEffect, useRef } from "react";
import { Box, CssBaseline, styled, type BoxProps } from "@mui/material";

import useFetchCities from "./hooks/useFetchCities";
import HeaderMain from "./components/Header";
import FooterMain from "./components/Footer";
import WeatherForecast from "./components/WeatherForecast";
import SnackbarContainer from "./components/ui/Feedback/SnackbarContainer";
import { GRID_GAP, NUM_OF_COLUMNS } from "./consts";

const EarthMain = lazy(() => import("./components/Earth"));
const SelectedCityMain = lazy(() => import("./components/Earth/SelectedCity"));

const AppContainer = (props: BoxProps) => <Box component="main" {...props} />;

const Main = styled(AppContainer)(({ theme }) => ({
    "--header_height": "3.6rem",
    "--footer_height": "3.6rem",

    scrollbarColor: `${theme.palette.primary.light} transparent`,
    scrollBehavior: "smooth",
    scrollMargin: 0,

    height: "100vh",
    width: "100vw",
    display: "grid",
    gridTemplateColumns: `repeat(${NUM_OF_COLUMNS}, 1fr)`,
    gridTemplateRows: `
        var(--header_height) 
        calc(100vh - var(--header_height) - var(--footer_height) - 2 * ${theme.spacing(GRID_GAP)}) 
        var(--footer_height)
    `,
    gap: theme.spacing(GRID_GAP),
}));

const App = () => {
    const justMounted = useRef(true);

    const cities = useFetchCities();

    useEffect(() => {
        if (justMounted.current) {
            (async () => {
                await Promise.allSettled([cities.handleFetch()]);
            })();
        }
        justMounted.current = false;
    }, [cities]);

    useEffect(() => {
        const event = new CustomEvent("second-passed");
        const interval = setInterval(() => {
            document.dispatchEvent(event);
        }, 1_000);
        return () => {
            clearInterval(interval);
        };
    }, []);

    return (
        <Main>
            <CssBaseline />
            <SnackbarContainer />

            <HeaderMain />
            <WeatherForecast />

            <Box
                sx={{
                    overflow: "hidden",
                    gridColumnStart: 1,
                    gridColumnEnd: 11,
                    position: "fixed",
                }}
            >
                <Box
                    sx={(theme) => ({
                        width: "132vw",
                        height: "100vh",
                        [theme.breakpoints.down("md")]: { width: "100vw" },
                    })}
                >
                    <Suspense fallback={null}>
                        <EarthMain />
                    </Suspense>
                </Box>
            </Box>

            <Suspense fallback={null}>
                <SelectedCityMain />
            </Suspense>

            <FooterMain />
        </Main>
    );
};

export default App;
