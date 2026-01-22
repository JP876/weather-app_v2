import { memo } from "react";
import { FormControlLabel, Stack, Switch } from "@mui/material";
import { useAtom, useAtomValue } from "jotai";

import { isLoadingWeatherDataAtom, userSettingsAtom } from "../../../atoms";

const UserSettings = () => {
    const [settings, setSettings] = useAtom(userSettingsAtom);
    const isLoading = useAtomValue(isLoadingWeatherDataAtom);

    const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
        const type = event.target.title as "cards" | "graph";
        setSettings((prevValue) => ({
            ...(prevValue || {}),
            hourly: { ...(prevValue?.hourly || {}), [type]: checked },
        }));
    };

    return (
        <Stack direction="row" alignItems="center" gap={1}>
            <FormControlLabel
                control={
                    <Switch
                        size="small"
                        checked={!!settings?.hourly?.cards}
                        onChange={handleOnChange}
                        slotProps={{ input: { title: "cards" } }}
                        disabled={isLoading}
                    />
                }
                label={settings?.hourly?.cards ? "Hide cards" : "Show cards"}
            />
            <FormControlLabel
                control={
                    <Switch
                        size="small"
                        checked={!!settings?.hourly?.graph}
                        onChange={handleOnChange}
                        slotProps={{ input: { title: "graph" } }}
                        disabled={isLoading}
                    />
                }
                label={settings?.hourly?.graph ? "Hide graph" : "Show graph"}
            />
        </Stack>
    );
};

export default memo(UserSettings);
