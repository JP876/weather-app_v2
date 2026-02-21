import { lazy, Suspense, useEffect, useRef } from "react";
import { Box, CssBaseline, styled, type BoxProps } from "@mui/material";

import useFetchCities from "./hooks/useFetchCities";
import HeaderMain from "./components/Header";
import FooterMain from "./components/Footer";
import WeatherForecast from "./components/WeatherForecast";
import SnackbarContainer from "./components/ui/Feedback/SnackbarContainer";
import { MARGIN_BLOCK } from "./consts";

const EarthMain = lazy(() => import("./components/Earth"));

const AppContainer = (props: BoxProps) => <Box component="main" {...props} />;

const Main = styled(AppContainer)(({ theme }) => ({
    "--header_height": "3.6rem",
    "--footer_height": "3.6rem",
    "--content-top-position": `calc(${theme.spacing(MARGIN_BLOCK)} + var(--header_height))`,
    scrollbarColor: `${theme.palette.primary.light} transparent`,
    scrollBehavior: "smooth",
    scrollMargin: 0,
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
            <Box sx={{ position: "relative" }}>
                <WeatherForecast />
            </Box>
            <Box sx={{ overflow: "hidden" }}>
                <Box
                    sx={(theme) => ({
                        width: "140vw",
                        height: "100vh",
                        [theme.breakpoints.down("md")]: { width: "100vw" },
                    })}
                >
                    <Suspense fallback={null}>
                        <EarthMain />
                    </Suspense>
                </Box>
            </Box>
            <FooterMain />
        </Main>
    );
};

export default App;
