import { useCallback } from "react";
import { useAtom, useAtomValue } from "jotai";
import {
    Box,
    CircularProgress,
    Stack,
    styled,
    Typography,
    type BoxProps,
    type StackProps,
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ClearIcon from "@mui/icons-material/Clear";
import { AutoSizer, List, type ListRowProps } from "react-virtualized";

import { favouriteCitiesAtom, filteredCitiesAtom } from "../../atoms";
import useCityListHeight from "./hooks/useCityListHeight";

type CityListItemType = {
    index: number;
};

type CityListItemContainerType = StackProps & {
    isFavourite: boolean;
};

const CityListItemContainer = styled(Stack, {
    shouldForwardProp: (prop) => prop !== "isFavourite",
})<CityListItemContainerType>(({ theme, isFavourite }) => ({
    paddingLeft: theme.spacing(2),
    paddingRight: "14px",
    cursor: "pointer",
    backgroundColor: isFavourite ? theme.palette.grey[100] : "transparent",
    transition: theme.transitions.create(["background-color", "border-color"]),
    border: `1px solid ${isFavourite ? theme.palette.primary.main : "transparent"}`,
    borderRadius: theme.shape.borderRadius,

    "&:hover": {
        backgroundColor: theme.palette.grey[200],
    },
}));

const CityListItemButton = styled(Box)<BoxProps>(({ theme }) => ({
    width: "1.5rem",
    height: "1.5rem",
    position: "relative",

    "& svg": {
        position: "absolute",
        transition: theme.transitions.create(["opacity"]),
    },
}));

const CityListItem = ({ index }: CityListItemType) => {
    const [favouriteCities, setFavouriteCities] = useAtom(favouriteCitiesAtom);
    const filteredCities = useAtomValue(filteredCitiesAtom);

    const cityInfo = filteredCities?.[index] || null;

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
                return prevValue.filter((city) => city.id.toString() !== cityInfo.id.toString());
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
            <CityListItemButton>
                <FavoriteBorderIcon sx={{ opacity: +!isFavourite }} />
                <ClearIcon sx={{ opacity: +isFavourite }} />
            </CityListItemButton>
        </CityListItemContainer>
    );
};

const listStyle = {
    padding: "1rem",
};

const CityList = () => {
    const filteredCities = useAtomValue(filteredCitiesAtom);
    const { height } = useCityListHeight();

    const rowRenderer = useCallback(({ index, key, style }: ListRowProps) => {
        return (
            <Box key={key} style={style}>
                <CityListItem index={index} />
            </Box>
        );
    }, []);

    if (!Array.isArray(filteredCities)) {
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
                    rowCount={filteredCities.length}
                    rowHeight={54}
                    rowRenderer={rowRenderer}
                    style={listStyle}
                />
            )}
        </AutoSizer>
    );
};

export default CityList;
