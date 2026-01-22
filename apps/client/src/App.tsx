import { useEffect } from "react";
import { Box } from "@mui/material";
import { useSetAtom } from "jotai";

import { citiesFetchInfoAtom, filteredCitiesAtom } from "./atoms";
import type { CityType } from "./types";
import WeatherForecast from "./WeatherForecast";

const App = () => {
    const setCitiesFetchInfo = useSetAtom(citiesFetchInfoAtom);
    const setFilteredCities = useSetAtom(filteredCitiesAtom);

    useEffect(() => {
        setCitiesFetchInfo((prevValue) => ({ ...prevValue, isLoading: true, error: false }));

        fetch("/api/v1/worldcities")
            .then(async (res) => {
                if (!res.ok) {
                    throw new Error("Failed to fetch cities data");
                }

                const data = (await res.json()) as { results: CityType[] };

                setCitiesFetchInfo({ data: data.results, isLoading: false, error: false });
                setFilteredCities(data?.results);
            })
            .catch((err) => {
                console.error(err);
                setCitiesFetchInfo({ data: [], isLoading: false, error: false });
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
