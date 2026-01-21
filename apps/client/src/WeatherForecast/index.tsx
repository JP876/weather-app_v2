import { Box, Paper } from "@mui/material";

import CitiesNavigation from "./CitiesNavigation";
import RouterMain from "./Router";

const WeatherForecast = () => {
    return (
        <Paper
            sx={(theme) => ({
                position: "absolute",
                top: theme.spacing(4),
                left: theme.spacing(4),
                zIndex: theme.zIndex.appBar,
                width: "36vw",
                "--weather-forecast-container-width": "36vw",
            })}
        >
            <CitiesNavigation />

            <Box
                id="forecast-container"
                sx={[
                    (theme) => ({
                        // 100vh - 2 * top/bottom main "margin" - tabs height
                        maxHeight: `calc(100vh - 2 * ${theme.spacing(4)} - 3rem)`,
                        overflow: "hidden",
                        position: "relative",
                    }),
                ]}
            >
                <RouterMain />
            </Box>
        </Paper>
    );
};

export default WeatherForecast;
