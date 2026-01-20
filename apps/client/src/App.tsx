import { useEffect } from "react";
import { Box, Stack } from "@mui/material";
import { useSetAtom } from "jotai";

import WeatherForecast from "./WeatherForecast";
import { citiesAtom } from "./atoms";
import type { CityType } from "./types";

const App = () => {
    const setCities = useSetAtom(citiesAtom);

    useEffect(() => {
        fetch("/api/v1/worldcities")
            .then(async (res) => {
                const data = (await res.json()) as { results: CityType[] };
                setCities(data?.results);
            })
            .catch((err) => {
                setCities([]);
                console.error(err);
            });
    }, [setCities]);

    return (
        <Stack direction="row" p={6}>
            <Box sx={{ flex: "0 0 40%", position: "relative" }}>
                <WeatherForecast />
            </Box>
        </Stack>
    );
};

export default App;
