import { memo, useCallback } from "react";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { type SelectChangeEvent } from "@mui/material/Select";
import { styled, useColorScheme } from "@mui/material/styles";
import { useAtom } from "jotai";

import { generalSettingAtom } from "../../../../atoms";
import SelectMain, { type SelectItemType } from "../../../ui/SelectMain";
import Clock from "../../../ui/Clock";
import type {
    CityItemType,
    GeneralSettingsType,
    MouseClickActionType,
    ThemeModeType,
    UnitsType,
} from "../../../../atoms/types";
import SaveButton from "./SaveButton";
import CloseModalButton from "../CloseModalButton";
import CityListItemConfig from "./CityListItemConfig";

const formatOptions: SelectItemType[] = [
    { value: "HH:mm:ss dd/MMM/yyyy", label: "HH:mm:ss dd/MMM/yyyy" },
    { value: "HH:mm:ss dd/MM/yyyy", label: "HH:mm:ss dd/MM/yyyy" },
    { value: "HH:mm dd/MMM/yyyy", label: "HH:mm dd/MMM/yyyy" },
    { value: "HH:mm dd/MM/yyyy", label: "HH:mm dd/MM/yyyy" },
];

const addCityActions: SelectItemType<MouseClickActionType>[] = [
    { label: "Add/remove the city to/from navigation bar", value: "add" },
    { label: "Add the city and immediately open it", value: "navigate" },
];

const modeOptions: SelectItemType<ThemeModeType>[] = [
    { label: "Light", value: "light" },
    { label: "System", value: "system" },
    { label: "Dark", value: "dark" },
];

const unitOptions: SelectItemType<UnitsType>[] = [
    { label: "Metric", value: "metric" },
    { label: "Imperial", value: "imperial" },
];

const SectionContainer = styled(Box)(({ theme }) => ({
    display: "grid",
    gridTemplateColumns: "1fr 1.4fr",
    alignItems: "center",
    gap: theme.spacing(2),
}));

const SettingsActions = memo(() => {
    return (
        <Stack direction="row" alignItems="center" justifyContent="flex-end" gap={2}>
            <SaveButton />
            <CloseModalButton />
        </Stack>
    );
});

const ThemeMode = memo(() => {
    const { mode, setMode } = useColorScheme();

    return (
        <SectionContainer>
            <Typography>Theme mode</Typography>
            <SelectMain
                items={modeOptions}
                value={mode}
                onChange={(event) => {
                    setMode(event.target.value as ThemeModeType);
                }}
            />
        </SectionContainer>
    );
});

type GenearlAppSettingsProps = {
    units: string;
    dateFormat: string;
    updateSettings: (e: SelectChangeEvent) => void;
};

const GenearlAppSettings = memo(
    ({ units, dateFormat, updateSettings }: GenearlAppSettingsProps) => {
        return (
            <Stack gap={2}>
                <ThemeMode />
                <SectionContainer>
                    <Typography variant="body1">Units of measurement</Typography>
                    <SelectMain
                        name="units"
                        items={unitOptions}
                        value={units}
                        onChange={updateSettings}
                    />
                </SectionContainer>
                <SectionContainer>
                    <Stack>
                        <Typography variant="body1">Header date format</Typography>
                        <Clock format={dateFormat} variant="caption" />
                    </Stack>
                    <SelectMain
                        name="dateFormat"
                        items={formatOptions}
                        value={dateFormat}
                        onChange={updateSettings}
                    />
                </SectionContainer>
            </Stack>
        );
    },
);

type AddCityTabSettingsProps = {
    leftClick: string;
    middleClick: string;
    cityItem: CityItemType;
    updateSettings: (e: SelectChangeEvent) => void;
};

const AddCityTabSettings = memo(
    ({ leftClick, middleClick, cityItem, updateSettings }: AddCityTabSettingsProps) => {
        return (
            <Stack mt={2}>
                <Divider sx={{ mb: 2 }}>
                    <Typography variant="subtitle1" sx={{ minWidth: "8rem" }}>
                        Add city tab
                    </Typography>
                </Divider>
                <SectionContainer>
                    <Typography variant="body1">Left mouse click</Typography>
                    <SelectMain
                        name="leftClick"
                        items={addCityActions}
                        value={leftClick}
                        onChange={updateSettings}
                    />
                    <Typography variant="body1">Middle mouse click</Typography>
                    <SelectMain
                        name="middleClick"
                        items={addCityActions}
                        value={middleClick}
                        onChange={updateSettings}
                    />
                </SectionContainer>
                <CityListItemConfig value={cityItem} />
            </Stack>
        );
    },
);

const GeneralSettingsMain = () => {
    const [settings, setSettings] = useAtom(generalSettingAtom);

    const updateSettings = useCallback(
        (event: SelectChangeEvent) => {
            const value = event.target.value as string;
            const name = event.target.name as keyof GeneralSettingsType;

            setSettings((prevValue) => {
                return { ...prevValue, [name]: value };
            });
        },
        [setSettings],
    );

    return (
        <Stack gap={2}>
            <GenearlAppSettings
                updateSettings={updateSettings}
                units={settings.units}
                dateFormat={settings.dateFormat}
            />
            <AddCityTabSettings
                updateSettings={updateSettings}
                leftClick={settings.leftClick}
                middleClick={settings.middleClick}
                cityItem={settings.cityItem}
            />
            <Divider />
            <SettingsActions />
        </Stack>
    );
};

export default GeneralSettingsMain;
