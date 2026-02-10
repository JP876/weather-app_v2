import { lazy, Suspense, useEffect, useRef } from "react";
import { Box, CssBaseline } from "@mui/material";

import useFetchCities from "./hooks/useFetchCities";
import HeaderMain from "./components/Header";
import FooterMain from "./components/Footer";
import WeatherForecast from "./components/WeatherForecast";
import SnackbarContainer from "./components/ui/Feedback/SnackbarContainer";

const EarthMain = lazy(() => import("./components/Earth"));

const App = () => {
    const justMounted = useRef(true);

    const cities = useFetchCities();

    useEffect(() => {
        if (justMounted.current) {
            (async () => {
                Promise.allSettled([cities.handleFetch()]);
            })();
        }
        justMounted.current = false;
    }, [cities]);

    return (
        <Box component="main" sx={{ "--header_height": "3.6rem", "--footer_height": "3.6rem" }}>
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
        </Box>
    );
};

export default App;
