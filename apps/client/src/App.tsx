import { useEffect, useRef } from "react";
import { Box, CssBaseline } from "@mui/material";

import SnackbarContainer from "./components/Feedback/SnackbarContainer";
import useFetchCities from "./hooks/useFetchCities";
import HeaderMain from "./components/Header";
import FooterMain from "./components/Footer";
import WeatherForecast from "./components/WeatherForecast";

const App = () => {
    const justMounted = useRef(true);

    const { handleFetch } = useFetchCities();

    useEffect(() => {
        if (justMounted.current) {
            handleFetch();
        }
        justMounted.current = false;
    }, [handleFetch]);

    return (
        <Box component="main" sx={{ "--header_height": "4rem", "--footer_height": "4rem" }}>
            <CssBaseline />
            <HeaderMain />
            <SnackbarContainer />
            <Box sx={{ position: "relative" }}>
                <WeatherForecast />
            </Box>
            <FooterMain />
        </Box>
    );
};

export default App;
