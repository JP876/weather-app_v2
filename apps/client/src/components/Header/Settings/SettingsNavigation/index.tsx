import { useState } from "react";
import { Box, Tab, Tabs, type BoxProps } from "@mui/material";
import GeneralSettingsMain from "../GeneralSettings";

type TabPanelProps = Omit<BoxProps, "id" | "hidden"> & {
    children: React.ReactNode;
    index: number;
    value: number;
};

const a11yProps = (index: number) => {
    return {
        id: `vertical-tab-${index}`,
        "aria-controls": `vertical-tabpanel-${index}`,
    };
};

const TabPanel = ({ children, index, value, ...rest }: TabPanelProps) => {
    return (
        <Box
            role="tabpanel"
            hidden={value !== index}
            id={`vertical-tabpanel-${index}`}
            aria-labelledby={`vertical-tab-${index}`}
            {...rest}
        >
            {value === index && children}
        </Box>
    );
};

const SettingsNavigation = () => {
    const [value, setValue] = useState(0);

    const handleChange = (_: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <Box sx={{ display: "grid", gridTemplateColumns: "18% 1fr", gap: 4 }}>
            <Tabs
                orientation="vertical"
                variant="scrollable"
                value={value}
                onChange={handleChange}
                aria-label="Settings vertical tabs"
                sx={{ borderRight: 1, borderColor: "divider" }}
            >
                <Tab label="General" {...a11yProps(0)} />
            </Tabs>

            <TabPanel value={value} index={0}>
                <GeneralSettingsMain />
            </TabPanel>
        </Box>
    );
};

export default SettingsNavigation;
