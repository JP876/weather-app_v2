import { Box, Stack, Typography } from "@mui/material";
import { useAtom } from "jotai";

import Clock from "../../../ui/Clock";
import { generalSettingAtom } from "../../../../atoms";
import SelectMain, { type SelectItemType } from "../../../ui/SelectMain";
import SettingsSection from "../SettingsSection";

const formatOptions: SelectItemType[] = [
    { value: "HH:mm:ss dd/MMM/yyyy", label: "HH:mm:ss dd/MMM/yyyy" },
    { value: "HH:mm dd/MMM/yyyy", label: "HH:mm dd/MMM/yyyy" },
    { value: "HH:mm dd/MM/yyyy", label: "HH:mm dd/MM/yyyy" },
    { value: "HH:mm dd/MM/yy", label: "HH:mm dd/MM/yy" },
];

const GeneralSettingsMain = () => {
    const [settings, setSettings] = useAtom(generalSettingAtom);

    return (
        <SettingsSection label="General">
            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", alignItems: "center" }}>
                <Stack>
                    <Typography variant="body1" mb={0.4}>
                        Date format
                    </Typography>
                    <Clock format={settings.dateFormat} />
                </Stack>
                <SelectMain
                    label="Format"
                    items={formatOptions}
                    value={settings.dateFormat}
                    onChange={(event) => {
                        setSettings((prevValue) => ({
                            ...prevValue,
                            dateFormat: event.target.value as string,
                        }));
                    }}
                />
            </Box>

            <Box sx={{ display: "grid", gridTemplateColumns: "2fr 1fr", alignItems: "center" }}>
                <Stack>
                    <Typography variant="body1" mb={0.4}>
                        Add city action
                    </Typography>
                    <Typography variant="caption">
                        Left-click: Add the city to the navigation bar.
                    </Typography>
                    <Typography variant="caption">
                        Middle-click: Add the city and immediately open it.
                    </Typography>
                </Stack>
                <SelectMain
                    label="Action"
                    items={[
                        { label: "Default", value: "default" },
                        { label: "Inversely", value: "inversely" },
                    ]}
                    value={settings.addCityMode}
                    onChange={(event) => {
                        setSettings((prevValue) => ({
                            ...prevValue,
                            addCityMode: event.target.value as "default" | "inversely",
                        }));
                    }}
                />
            </Box>
        </SettingsSection>
    );
};

export default GeneralSettingsMain;
