import { useEffect } from "react";
import { Box, CssBaseline } from "@mui/material";

import WeatherForecast from "./WeatherForecast";
import SnackbarContainer from "./components/Feedback/SnackbarContainer";
import useFetchCities from "./hooks/useFetchCities";
import HeaderMain from "./components/Header";
import FooterMain from "./components/Footer";

const App = () => {
    const { fetchCities } = useFetchCities();

    useEffect(() => {
        fetchCities();
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
