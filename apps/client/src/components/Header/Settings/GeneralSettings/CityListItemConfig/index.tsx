import { memo } from "react";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { useSetAtom } from "jotai";

import PreviewCity from "./PreviewCity";
import CityOptions from "./CityOptions";
import type { CityItemType } from "../../../../../atoms/types";
import { generalSettingAtom, initialCityDescription } from "../../../../../atoms";
import useDelay from "../../../../../hooks/useDelay";

const SettingTitle = memo(() => {
    const setSettings = useSetAtom(generalSettingAtom);
    const { loading, start } = useDelay(200);

    const handleResetCitySettings = async () => {
        await start();
        setSettings((prevValue) => ({ ...prevValue, cityItem: initialCityDescription }));
    };

    return (
        <Stack mb={1}>
            <Stack direction="row" alignItems="center" gap={1}>
                <Typography variant="subtitle1">City item settings</Typography>
                <Tooltip arrow disableInteractive title="Reset settings" placement="right">
                    <span>
                        <IconButton
                            loading={loading}
                            disabled={loading}
                            onClick={handleResetCitySettings}
                            size="small"
                        >
                            <RestartAltIcon />
                        </IconButton>
                    </span>
                </Tooltip>
            </Stack>
            <Typography variant="caption">
                Choose the information you want to display. A random city is used for preview.
            </Typography>
        </Stack>
    );
});

const CityListItemConfig = ({ value }: { value: CityItemType }) => {
    return (
        <Stack mt={2} gap={1}>
            <SettingTitle />
            <PreviewCity value={value} />
            <CityOptions value={value} />
        </Stack>
    );
};

export default memo(CityListItemConfig);
