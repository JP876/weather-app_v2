import { memo } from "react";
import { Stack } from "@mui/material";
import { useAtomValue } from "jotai";

import { userSettingsAtom, weatherFetchInfoAtom } from "../../../../atoms";
import UserSettingSwitch from "../../../ui/UserSettingSwitch";

const UserSettings = () => {
    const settings = useAtomValue(userSettingsAtom);
    const { isLoading, error } = useAtomValue(weatherFetchInfoAtom);

    return (
        <Stack gap={0.5} direction="row">
            <UserSettingSwitch
                checked={!!settings?.hourly?.cards}
                label={settings?.hourly?.cards ? "Hide cards" : "Show cards"}
                title="cards"
                settingKey="hourly"
                disabled={isLoading || !!error}
            />
            <UserSettingSwitch
                checked={!!settings?.hourly?.graph}
                label={settings?.hourly?.graph ? "Hide graph" : "Show graph"}
                title="graph"
                settingKey="hourly"
                disabled={isLoading || !!error}
            />
        </Stack>
    );
};

export default memo(UserSettings);
