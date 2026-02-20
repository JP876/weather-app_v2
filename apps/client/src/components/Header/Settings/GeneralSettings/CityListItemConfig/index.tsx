import { memo } from "react";
import { Stack, Typography } from "@mui/material";

import PreviewCity from "./PreviewCity";
import CityOptions from "./CityOptions";
import type { CityItemType } from "../../../../../atoms/types";

const SettingTitle = memo(() => {
    return (
        <Stack mb={1}>
            <Typography variant="subtitle1">City item settings</Typography>
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
