import { Box } from "@mui/material";

import CityList from "./CityList";

const AddCityMain = () => {
    return (
        <Box sx={{ height: "80vh", overflowY: "scroll" }}>
            <CityList />
        </Box>
    );
};

export default AddCityMain;
