import { memo } from "react";
import { Stack } from "@mui/material";
import { useAtomValue } from "jotai";

import { userSettingsAtom, weatherFetchInfoAtom } from "../../../../atoms";
import UserSettingSwitch from "../../../UserSettingSwitch";

const UserSettings = () => {
    const settings = useAtomValue(userSettingsAtom);
    const { isLoading, error } = useAtomValue(weatherFetchInfoAtom);

    return (
        <Stack
            gap={0.5}
            sx={(theme) => ({
                flexDirection: "row",
                [theme.breakpoints.down("lg")]: {
                    flexDirection: "column",
                },
            })}
        >
            <UserSettingSwitch
                checked={!!settings?.daily?.list}
                label={settings?.daily?.list ? "Hide list" : "Show list"}
                title="list"
                settingKey="daily"
                disabled={isLoading || !!error}
            />
            <UserSettingSwitch
                checked={!!settings?.daily?.graph}
                label={settings?.daily?.graph ? "Hide graph" : "Show graph"}
                title="graph"
                settingKey="daily"
                disabled={isLoading || !!error}
            />
        </Stack>
    );
};

export default memo(UserSettings);
