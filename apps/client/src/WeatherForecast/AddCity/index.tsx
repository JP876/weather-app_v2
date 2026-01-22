import { Box, Divider, Stack } from "@mui/material";

import CityList from "./CityList";
import CitySearch from "./CitySearch";

const AddCityMain = () => {
    return (
        <Stack sx={{ height: "var(--weather-forecast-routes-container-height)" }}>
            <Box id="city-search-container" sx={{ p: 2 }}>
                <CitySearch />
            </Box>
            <Divider />
            <Box sx={{ overflowY: "scroll", overflowX: "hidden" }}>
                <CityList />
            </Box>
        </Stack>
    );
};

export default AddCityMain;
