import { useEffect } from "react";
import { Box, Divider, Stack } from "@mui/material";
import { useAtomValue } from "jotai";

import { citiesFetchInfoAtom } from "../../../atoms";
import CitySearch from "./CitySearch";
import CityList from "./CityList";
import LoadingData from "../../ui/Feedback/LoadingData";

const FetchLoadingData = () => {
    const { isLoading, error } = useAtomValue(citiesFetchInfoAtom);

    useEffect(() => {
        const routesContainer = document.getElementById("forecast-routes-container");

        if (routesContainer) {
            routesContainer.style.overflow = isLoading || !!error ? "hidden" : "auto";
            routesContainer.style.pointerEvents = isLoading || !!error ? "none" : "all";
        }
    }, [error, isLoading]);

    return <LoadingData isLoading={isLoading} error={!!error} />;
};

const AddCityMain = () => {
    return (
        <Stack sx={{ height: "var(--routes-container-height)" }}>
            <FetchLoadingData />
            <Box id="city-search-container" sx={{ p: 2 }}>
                <CitySearch />
            </Box>
            <Divider sx={{ mx: 2 }} />
            <Box sx={{ overflow: "hidden" }}>
                <CityList />
            </Box>
        </Stack>
    );
};

export default AddCityMain;
