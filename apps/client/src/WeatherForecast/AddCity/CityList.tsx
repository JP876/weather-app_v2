import { useCallback } from "react";
import { useAtomValue } from "jotai";
import { Box, CircularProgress, IconButton, Stack, Typography } from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { List, type ListRowProps } from "react-virtualized";

import { worldcitiesAtom } from "../../atoms";
import type { CityType } from "../../types";

type CityListItemType = {
    cityInfo: CityType | null;
};

const CityListItem = ({ cityInfo }: CityListItemType) => {
    if (!cityInfo) return null;

    return (
        <Stack
            direction="row"
            alignItems="center"
            sx={{ width: "100%", pr: 2 }}
            justifyContent="space-between"
        >
            <Stack direction="row" alignItems="center" gap={2}>
                <Box
                    component="img"
                    width={28}
                    height={20}
                    src={`https://flagcdn.com/w40/${cityInfo.iso2.toLowerCase()}.png`}
                    alt={`${cityInfo.country} flag`}
                />
                <Stack>
                    <Typography mb={-0.5} variant="subtitle1">
                        {cityInfo.city}
                    </Typography>
                    <Typography variant="caption">{cityInfo.country}</Typography>
                </Stack>
            </Stack>
            <IconButton size="small">
                <FavoriteBorderIcon />
            </IconButton>
        </Stack>
    );
};

const CityList = () => {
    const worldcities = useAtomValue(worldcitiesAtom);

    const rowRenderer = useCallback(
        ({ index, key, style }: ListRowProps) => {
            const cityInfo = worldcities?.[index] || null;
            return (
                <Box key={key} sx={style}>
                    <CityListItem cityInfo={cityInfo} />
                </Box>
            );
        },
        [worldcities],
    );

    if (!Array.isArray(worldcities)) {
        return (
            <Stack direction="row" justifyContent="center" alignItems="center" sx={{ mt: 6 }}>
                <CircularProgress size={60} thickness={3.2} />
            </Stack>
        );
    }

    return (
        <List
            width={600}
            height={850}
            rowCount={worldcities.length}
            rowHeight={52}
            rowRenderer={rowRenderer}
        />
    );
};

export default CityList;
