import { memo } from "react";
import { FormControlLabel, Stack, Switch } from "@mui/material";
import { useAtom, useAtomValue } from "jotai";

import { isLoadingWeatherDataAtom, userSettingsAtom } from "../../../atoms";

const UserSettings = () => {
    const [settings, setSettings] = useAtom(userSettingsAtom);
    const isLoading = useAtomValue(isLoadingWeatherDataAtom);

    const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
        const type = event.target.title as "list" | "graph";
        setSettings((prevValue) => ({
            ...(prevValue || {}),
            daily: { ...(prevValue?.daily || {}), [type]: checked },
        }));
    };

    return (
        <Stack direction="row" alignItems="center" gap={1}>
            <FormControlLabel
                control={
                    <Switch
                        size="small"
                        checked={settings.daily.list}
                        onChange={handleOnChange}
                        slotProps={{ input: { title: "list" } }}
                        disabled={isLoading}
                    />
                }
                label={settings.daily.list ? "Hide list" : "Show list"}
            />
            <FormControlLabel
                control={
                    <Switch
                        size="small"
                        checked={settings.daily.graph}
                        onChange={handleOnChange}
                        slotProps={{ input: { title: "graph" } }}
                        disabled={isLoading}
                    />
                }
                label={settings.daily.graph ? "Hide graph" : "Show graph"}
            />
        </Stack>
    );
};

export default memo(UserSettings);
