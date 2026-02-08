import { useCallback } from "react";
import { useAtom, useAtomValue } from "jotai";
import { Box, Stack, styled, Typography, type BoxProps, type StackProps } from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ClearIcon from "@mui/icons-material/Clear";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { AutoSizer, List, type ListRowProps } from "react-virtualized";

import useCityListHeight from "./hooks/useCityListHeight";
import CityListSkeleton from "./CityListSkeleton";
import { citiesFetchInfoAtom, favouriteCitiesAtom, filteredCitiesAtom } from "../../../atoms";
import { ClampedText } from "../../styledComps";
import { db } from "../../../utils/db";

type CityListItemType = {
    index: number;
};

export const CityListItemContainer = styled(Stack, {
    shouldForwardProp: (prop) => prop !== "isFavourite",
})<StackProps<"div", { isFavourite: boolean }>>(({ theme, isFavourite }) => ({
    paddingInline: theme.spacing(2),
    cursor: "pointer",
    backgroundColor: isFavourite ? theme.palette.grey[100] : "transparent",
    transition: theme.transitions.create(["background-color", "border-color"]),
    border: `1px solid ${isFavourite ? theme.palette.primary.dark : "transparent"}`,
    borderRadius: theme.shape.borderRadius,
    gap: theme.spacing(4),

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

    const isFavourite = (favouriteCities || []).some(
        (city) => city.id.toString() === cityInfo?.id.toString(),
    );

    const deleteDataFromDB = () => {
        if (!cityInfo) return;
        (async () => {
            try {
                const cityId = +cityInfo.id;
                await db.weatherData.delete(cityId);
            } catch (err: unknown) {
                console.error(err);
            }
        })();
    };

    const saveFavouriteCity = () => {
        if (!cityInfo) {
            console.warn("City info not found");
            return;
        }

        setFavouriteCities((prevValue) => {
            if (isFavourite) {
                deleteDataFromDB();
                return (prevValue || []).filter(
                    (city) => city.id.toString() !== cityInfo.id.toString(),
                );
            }
            return [...(prevValue || []), cityInfo];
        });
    };

    if (!cityInfo) return null;

    return (
        <CityListItemContainer
            id={`city_container-${index}`}
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
                    <ClampedText
                        variant="subtitle1"
                        sx={(theme) => ({
                            marginBottom: theme.spacing(-0.5),
                            fontWeight: theme.typography.fontWeightBold,
                            fontSize: theme.typography.h6.fontSize,
                        })}
                    >
                        {cityInfo.city}
                    </ClampedText>
                    <Typography variant="caption">{cityInfo.country}</Typography>
                </Stack>
            </Stack>
            <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={(theme) => ({
                    flex: "0 0 42%",
                    [theme.breakpoints.down("lg")]: {
                        justifyContent: "flex-end",
                        flex: "0 0 max-content",
                    },
                })}
            >
                <Stack
                    direction="row"
                    alignItems="center"
                    gap={1}
                    sx={(theme) => ({
                        [theme.breakpoints.down("lg")]: { display: "none" },
                    })}
                >
                    <LocationOnIcon fontSize="small" />
                    <Typography variant="body2">
                        {`${parseFloat(cityInfo.lat.toString()).toFixed(2)} - 
                        ${parseFloat(cityInfo.lng.toString()).toFixed(2)}`}
                    </Typography>
                </Stack>
                <CityListItemButton>
                    <FavoriteBorderIcon sx={{ opacity: +!isFavourite }} />
                    <ClearIcon sx={{ opacity: +isFavourite }} />
                </CityListItemButton>
            </Stack>
        </CityListItemContainer>
    );
};

const listStyle: React.CSSProperties = {
    paddingLeft: "1rem",
    paddingBlock: "1rem",
};

const CityList = () => {
    const { isLoading, error } = useAtomValue(citiesFetchInfoAtom);
    const filteredCities = useAtomValue(filteredCitiesAtom);

    const { height } = useCityListHeight();

    const rowRenderer = useCallback(({ index, key, style }: ListRowProps) => {
        return (
            <Box key={key} style={style}>
                <CityListItem index={index} />
            </Box>
        );
    }, []);

    if (isLoading || !!error || filteredCities === null) {
        return <CityListSkeleton />;
    }

    return (
        <AutoSizer disableHeight>
            {({ width }) => (
                <List
                    width={width}
                    height={height || 960}
                    rowCount={filteredCities.length}
                    rowHeight={58}
                    rowRenderer={rowRenderer}
                    style={listStyle}
                />
            )}
        </AutoSizer>
    );
};

export default CityList;
