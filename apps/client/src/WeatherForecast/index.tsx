import { Paper } from "@mui/material";

import CitiesNavigation from "./CitiesNavigation";

const WeatherForecast = () => {
    return (
        <Paper
            id="wether-forecast-container"
            sx={{ height: `calc(${window.innerHeight}px - 6rem)` }}
        >
            <CitiesNavigation />
        </Paper>
    );
};

export default WeatherForecast;
