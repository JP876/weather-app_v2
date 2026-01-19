import { useEffect } from "react";
import { Box, Stack } from "@mui/material";
import { useSetAtom } from "jotai";

import WeatherForecast from "./WeatherForecast";
import { worldcitiesAtom } from "./atoms";
import type { CityType } from "./types";

const App = () => {
    const setWorldCities = useSetAtom(worldcitiesAtom);

    useEffect(() => {
        fetch("/api/v1/worldcities")
            .then(async (res) => {
                const data = (await res.json()) as { results: CityType[] };
                setWorldCities(data?.results);
            })
            .catch((err) => {
                setWorldCities([]);
                console.error(err);
            });
    }, [setWorldCities]);

    return (
        <Stack direction="row" p={6}>
            <Box sx={{ flex: "0 0 50%" }}>
                <WeatherForecast />
            </Box>
        </Stack>
    );
};

export default App;
