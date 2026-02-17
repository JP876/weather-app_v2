import { memo, useCallback } from "react";
import { Box, Divider, Stack, styled, Typography, useColorScheme } from "@mui/material";
import { useAtom } from "jotai";

import { generalSettingAtom } from "../../../../atoms";
import SelectMain, { type SelectItemType } from "../../../ui/SelectMain";
import Clock from "../../../ui/Clock";
import type {
    GeneralSettingsType,
    MouseClickActionType,
    ThemeModeType,
} from "../../../../atoms/types";
import SaveButton from "./SaveButton";
import CloseModalButton from "../CloseModalButton";

const formatOptions: SelectItemType[] = [
    { value: "HH:mm:ss dd/MMM/yyyy", label: "HH:mm:ss dd/MMM/yyyy" },
    { value: "HH:mm:ss dd/MM/yyyy", label: "HH:mm:ss dd/MM/yyyy" },
    { value: "HH:mm dd/MMM/yyyy", label: "HH:mm dd/MMM/yyyy" },
    { value: "HH:mm dd/MM/yyyy", label: "HH:mm dd/MM/yyyy" },
];

const addCityActions: SelectItemType[] = [
    { label: "Add/remove the city to/from navigation bar", value: "add" },
    { label: "Add the city and immediately open it", value: "navigate" },
];

const modeOptions: SelectItemType[] = [
    { label: "Light", value: "light" },
    { label: "System", value: "system" },
    { label: "Dark", value: "dark" },
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

type SingleSettingProps<T> = {
    value: T;
    updateSettings: (value: Partial<GeneralSettingsType>) => void;
};

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

const HeaderDateFormat = memo(({ value, updateSettings }: SingleSettingProps<string>) => {
    return (
        <SectionContainer>
            <Stack>
                <Typography variant="body1">Header date format</Typography>
                <Clock format={value} variant="caption" />
            </Stack>
            <SelectMain
                items={formatOptions}
                value={value}
                onChange={(event) => {
                    updateSettings({ dateFormat: event.target.value as string });
                }}
            />
        </SectionContainer>
    );
});

const LeftMouseAction = memo(
    ({ value, updateSettings }: SingleSettingProps<MouseClickActionType>) => {
        return (
            <>
                <Typography variant="body1">Left mouse click</Typography>
                <SelectMain
                    items={addCityActions}
                    value={value}
                    onChange={(event) => {
                        const value = event.target.value as "add" | "navigate";
                        updateSettings({
                            leftClick: value,
                            middleClick: value === "add" ? "navigate" : "add",
                        });
                    }}
                />
            </>
        );
    },
);

const MiddleMouseAction = memo(
    ({ value, updateSettings }: SingleSettingProps<MouseClickActionType>) => {
        return (
            <>
                <Typography variant="body1">Middle mouse click</Typography>
                <SelectMain
                    items={addCityActions}
                    value={value}
                    onChange={(event) => {
                        const value = event.target.value as "add" | "navigate";
                        updateSettings({
                            middleClick: value,
                            leftClick: value === "add" ? "navigate" : "add",
                        });
                    }}
                />
            </>
        );
    },
);

const GeneralSettingsMain = () => {
    const [settings, setSettings] = useAtom(generalSettingAtom);

    const updateSettings = useCallback(
        (value: Partial<GeneralSettingsType>) => {
            setSettings((prevValue) => ({ ...prevValue, ...value }));
        },
        [setSettings],
    );

    return (
        <Stack gap={2}>
            <ThemeMode />
            <HeaderDateFormat value={settings.dateFormat} updateSettings={updateSettings} />
            <Stack mt={2}>
                <Divider textAlign="left" sx={{ mb: 1 }}>
                    <Typography variant="subtitle1" sx={{ minWidth: "8rem" }}>
                        Add city tab
                    </Typography>
                </Divider>
                <SectionContainer>
                    <LeftMouseAction value={settings.leftClick} updateSettings={updateSettings} />
                    <MiddleMouseAction
                        value={settings.middleClick}
                        updateSettings={updateSettings}
                    />
                </SectionContainer>
            </Stack>
            <Divider />
            <SettingsActions />
        </Stack>
    );
};

export default GeneralSettingsMain;
