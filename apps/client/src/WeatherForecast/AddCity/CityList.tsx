import { useCallback } from "react";
import { useAtom, useAtomValue } from "jotai";
import {
    Box,
    CircularProgress,
    IconButton,
    Stack,
    styled,
    Typography,
    type StackProps,
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { AutoSizer, List, type ListRowProps } from "react-virtualized";

import type { CityType } from "../../types";
import { citiesAtom, favouriteCitiesAtom } from "../../atoms";
import useCityListHeight from "./hooks/useCityListHeight";

type CityListItemType = {
    cityInfo: CityType | null;
};

type CityListItemContainerType = StackProps & {
    isFavourite: boolean;
};

const CityListItemContainer = styled(Stack, {
    shouldForwardProp: (prop) => prop !== "isFavourite",
})<CityListItemContainerType>(({ theme, isFavourite }) => ({
    paddingInline: theme.spacing(2),
    cursor: "pointer",
    backgroundColor: isFavourite ? theme.palette.grey[100] : "transparent",
    transition: theme.transitions.create(["background-color", "border-color"]),
    border: `1px solid ${isFavourite ? theme.palette.primary.main : "transparent"}`,
    borderRadius: theme.shape.borderRadius,

    "&:hover": {
        backgroundColor: theme.palette.grey[200],
    },
}));

const CityListItem = ({ cityInfo }: CityListItemType) => {
    const [favouriteCities, setFavouriteCities] = useAtom(favouriteCitiesAtom);

    const isFavourite = favouriteCities.some(
        (city) => city.id.toString() === cityInfo?.id.toString(),
    );

    const saveFavouriteCity = () => {
        if (!cityInfo) {
            console.warn("City info not found");
            return;
        }
        setFavouriteCities((prevValue) => {
            if (isFavourite) {
                return prevValue.filter(
                    (location) => location.id.toString() !== cityInfo.id.toString(),
                );
            }
            return [...(prevValue || []), cityInfo];
        });
    };

    if (!cityInfo) return null;

    return (
        <CityListItemContainer
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            isFavourite={isFavourite}
            onClick={saveFavouriteCity}
        >
            <Stack direction="row" alignItems="center" gap={2}>
                <Box
                    component="img"
                    width={32}
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
            <IconButton
                size="small"
                sx={(theme) => ({
                    "& svg": {
                        fill: isFavourite ? theme.palette.primary.main : theme.palette.grey[800],
                        transition: theme.transitions.create(["fill"]),
                    },
                })}
            >
                <FavoriteBorderIcon />
            </IconButton>
        </CityListItemContainer>
    );
};

const CityList = () => {
    const cities = useAtomValue(citiesAtom);
    const { height } = useCityListHeight();

    const rowRenderer = useCallback(
        ({ index, key, style }: ListRowProps) => {
            const cityInfo = cities?.[index] || null;
            return (
                <Box key={key} style={style}>
                    <CityListItem cityInfo={cityInfo} />
                </Box>
            );
        },
        [cities],
    );

    if (!Array.isArray(cities)) {
        return (
            <Stack direction="row" justifyContent="center" alignItems="center" sx={{ mt: 6 }}>
                <CircularProgress size={60} thickness={3.2} />
            </Stack>
        );
    }

    return (
        <AutoSizer disableHeight>
            {({ width }) => (
                <List
                    width={width}
                    height={height || 960}
                    rowCount={cities.length}
                    rowHeight={54}
                    rowRenderer={rowRenderer}
                    style={{ padding: "1rem" }}
                />
            )}
        </AutoSizer>
    );
};

export default CityList;
