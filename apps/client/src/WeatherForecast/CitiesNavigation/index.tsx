import { useState } from "react";
import { Box, Tab, Tabs, type BoxProps } from "@mui/material";

import AddCityMain from "../AddCity";

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

const CustomTabPanel = (props: TabPanelProps & BoxProps) => {
    const { children, value, index, ...other } = props;

    return (
        <Box
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box>{children}</Box>}
        </Box>
    );
};

const a11yProps = (index: number) => {
    return {
        id: `simple-tab-${index}`,
        "aria-controls": `simple-tabpanel-${index}`,
    };
};

const CitiesNavigation = () => {
    const [value, setValue] = useState(0);

    const handleChange = (_: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <Box sx={{ width: "100%" }}>
            <Box
                id="cities-navigation-tabs-container"
                sx={{ borderBottom: 1, borderColor: "divider" }}
            >
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                    <Tab label="Add city" {...a11yProps(0)} />
                </Tabs>
            </Box>
            <CustomTabPanel value={value} index={0}>
                <AddCityMain />
            </CustomTabPanel>
        </Box>
    );
};

export default CitiesNavigation;
