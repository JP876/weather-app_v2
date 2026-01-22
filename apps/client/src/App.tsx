import { useEffect } from "react";
import { Box } from "@mui/material";
import { useSetAtom } from "jotai";

import { citiesFetchInfoAtom, filteredCitiesAtom } from "./atoms";
import WeatherForecast from "./WeatherForecast";
import type { CityType } from "./types";

const App = () => {
    const setCitiesFetchInfo = useSetAtom(citiesFetchInfoAtom);
    const setFilteredCities = useSetAtom(filteredCitiesAtom);

    useEffect(() => {
        setCitiesFetchInfo((prevValue) => ({ ...prevValue, isLoading: true, error: false }));

        Promise.all([fetch("/api/v1/worldcities"), new Promise((res) => setTimeout(res, 1_000))])
            .then(async ([res]) => {
                if (!res.ok) {
                    throw new Error("Failed to fetch cities data");
                }

                const data = (await res.json()) as { results: CityType[] };

                setCitiesFetchInfo({ data: data.results, isLoading: false, error: false });
                setFilteredCities(data?.results);
            })
            .catch((err) => {
                const error = err as Error;
                setCitiesFetchInfo({ data: [], isLoading: false, error: { msg: error.message } });
                setFilteredCities([]);
            });
    }, [setCitiesFetchInfo, setFilteredCities]);

    return (
        <Box component="main">
            <Box sx={{ position: "relative" }}>
                <WeatherForecast />
            </Box>
        </Box>
    );
};

export default App;
