import { memo } from "react";
import { FormControlLabel, Switch } from "@mui/material";
import { useSetAtom } from "jotai";

import { userSettingsAtom } from "../../../atoms";

type UserSettingSwitchProps = {
    checked: boolean;
    label: string;
    title: string;
    settingKey: "daily" | "hourly";
    disabled?: boolean;
};

const UserSettingSwitch = ({
    checked,
    label,
    title,
    settingKey,
    disabled,
}: UserSettingSwitchProps) => {
    const setSettings = useSetAtom(userSettingsAtom);

    const handleOnChange = (_: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
        setSettings((prevValue) => ({
            ...(prevValue || {}),
            [settingKey]: { ...(prevValue?.[settingKey] || {}), [title]: checked },
        }));
    };

    return (
        <FormControlLabel
            control={
                <Switch
                    size="small"
                    checked={checked}
                    onChange={handleOnChange}
                    disabled={disabled}
                />
            }
            label={label}
        />
    );
};

export default memo(UserSettingSwitch);
