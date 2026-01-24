import { Box, Divider, Stack } from "@mui/material";
import { useAtomValue } from "jotai";

import CityList from "./CityList";
import CitySearch from "./CitySearch";
import LoadingData from "../../components/Feedback/LoadingData";
import { citiesFetchInfoAtom } from "../../atoms";

const FetchLoadingData = () => {
    const { isLoading, error } = useAtomValue(citiesFetchInfoAtom);
    return <LoadingData isLoading={isLoading} error={!!error} />;
};

const AddCityMain = () => {
    return (
        <Stack sx={{ height: "var(--weather-forecast-routes-container-height)" }}>
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
