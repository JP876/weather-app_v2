import { useEffect, useRef } from "react";
import { Box, CssBaseline } from "@mui/material";

import SnackbarContainer from "./components/Feedback/SnackbarContainer";
import useFetchCities from "./hooks/useFetchCities";
import HeaderMain from "./components/Header";
import FooterMain from "./components/Footer";
import WeatherForecast from "./components/WeatherForecast";

const App = () => {
    const justMounted = useRef(true);

    const { fetchCities } = useFetchCities();

    useEffect(() => {
        if (justMounted.current) {
            fetchCities();
        }
        justMounted.current = false;
    }, [fetchCities]);

    return (
        <Box component="main" sx={{ "--header_height": "3.6rem", "--footer_height": "3.6rem" }}>
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
