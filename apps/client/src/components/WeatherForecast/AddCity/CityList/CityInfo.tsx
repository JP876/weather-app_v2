import { memo } from "react";
import { Box, Stack, styled, Typography, type BoxProps } from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ClearIcon from "@mui/icons-material/Clear";
import LocationOnIcon from "@mui/icons-material/LocationOn";

import type { CityType } from "../../../../types";
import { ClampedText } from "../../../ui/styledComps";

type CityInfoProps = Pick<CityType, "iso2" | "country" | "city" | "lat" | "lng"> & {
    isFavourite: boolean;
};

const CityListItemButton = styled(Box)<BoxProps>(({ theme }) => ({
    width: "1.5rem",
    height: "1.5rem",
    position: "relative",

    "& svg": {
        position: "absolute",
        transition: theme.transitions.create(["opacity"]),
    },
}));

const CityInfo = memo(({ iso2, country, city, lat, lng, isFavourite }: CityInfoProps) => {
    return (
        <>
            <Stack direction="row" alignItems="center" gap={2}>
                <Box
                    component="img"
                    width={32}
                    height={20}
                    src={`https://flagcdn.com/w40/${iso2.toLowerCase()}.png`}
                    alt={`${country} flag`}
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
                        {city}
                    </ClampedText>
                    <Typography variant="caption">{country}</Typography>
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
                        {`${parseFloat(lat.toString()).toFixed(2)} - 
                        ${parseFloat(lng.toString()).toFixed(2)}`}
                    </Typography>
                </Stack>
                <CityListItemButton>
                    <FavoriteBorderIcon sx={{ opacity: +!isFavourite }} />
                    <ClearIcon sx={{ opacity: +isFavourite }} />
                </CityListItemButton>
            </Stack>
        </>
    );
});

export default CityInfo;
