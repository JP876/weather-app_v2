import { useEffect } from "react";
import { Box } from "@mui/material";
import { useSetAtom } from "jotai";

import { citiesAtom, filteredCitiesAtom } from "./atoms";
import type { CityType } from "./types";
import WeatherForecast from "./WeatherForecast";

const App = () => {
    const setCities = useSetAtom(citiesAtom);
    const setFilteredCities = useSetAtom(filteredCitiesAtom);

    useEffect(() => {
        fetch("/api/v1/worldcities")
            .then(async (res) => {
                if (!res.ok) {
                    throw new Error("Failed to fetch cities data");
                }

                const data = (await res.json()) as { results: CityType[] };

                setCities(data?.results);
                setFilteredCities(data?.results);
            })
            .catch((err) => {
                console.error(err);

                setCities([]);
                setFilteredCities([]);
            });
    }, [setCities, setFilteredCities]);

    return (
        <Box component="main">
            <Box sx={{ position: "relative" }}>
                <WeatherForecast />
            </Box>
        </Box>
    );
};

export default App;
