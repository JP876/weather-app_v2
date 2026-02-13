import { memo } from "react";
import { Box, Stack, styled, Typography, type BoxProps } from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ClearIcon from "@mui/icons-material/Clear";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

import type { CityType } from "../../../../types";
import ClampedTextContainer from "../../../ui/ClampedTextContainer";
import Clock from "../../../ui/Clock";

type CityInfoProps = Pick<CityType, "iso2" | "country" | "city" | "lat" | "lng" | "timezone"> & {
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

const CityInfo = memo(({ iso2, country, city, lat, lng, isFavourite, timezone }: CityInfoProps) => {
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
                    <ClampedTextContainer
                        variant="subtitle1"
                        sx={(theme) => ({
                            marginBottom: theme.spacing(-0.5),
                            fontWeight: theme.typography.fontWeightBold,
                            fontSize: theme.typography.h6.fontSize,
                        })}
                    >
                        {city}
                    </ClampedTextContainer>
                    <Typography variant="caption">{country}</Typography>
                </Stack>
            </Stack>
            <Stack direction="row" alignItems="center" justifyContent="space-between" gap={4}>
                <Box
                    sx={(theme) => ({
                        display: "grid",
                        gridTemplateColumns: "1fr",
                        fontSize: theme.typography.body2.fontSize,
                        gap: theme.spacing(0.4),
                        minWidth: "10rem",

                        [theme.breakpoints.down("md")]: {
                            display: "none",
                        },
                        svg: {
                            width: "1rem",
                            height: "1rem",
                        },
                    })}
                >
                    <Stack direction="row" alignItems="center" gap={1}>
                        <LocationOnIcon />
                        <Typography variant="body2">
                            {`${parseFloat(lat.toString()).toFixed(2)} - 
                        ${parseFloat(lng.toString()).toFixed(2)}`}
                        </Typography>
                    </Stack>
                    {timezone ? (
                        <Stack direction="row" alignItems="center" gap={1}>
                            <AccessTimeIcon />
                            <Clock timezone={timezone} format="HH:mm dd/MMM/yy" />
                        </Stack>
                    ) : null}
                </Box>
                <CityListItemButton>
                    <FavoriteBorderIcon sx={{ opacity: +!isFavourite }} />
                    <ClearIcon sx={{ opacity: +isFavourite }} />
                </CityListItemButton>
            </Stack>
        </>
    );
});

export default CityInfo;
