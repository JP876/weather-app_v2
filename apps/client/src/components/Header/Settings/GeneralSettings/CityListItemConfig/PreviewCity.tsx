import { useEffect, useRef, useState } from "react";
import { Box, Stack, Typography } from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocationCityIcon from "@mui/icons-material/LocationCity";

import type { CityDescriptionOptions, CityItemType } from "../../../../../atoms/types";
import type { CityType } from "../../../../../types";
import { db } from "../../../../../utils/db";
import ClampedTextContainer from "../../../../ui/ClampedTextContainer";
import Clock from "../../../../ui/Clock";

const PreviewCity = ({ value }: { value: CityItemType }) => {
    const justMounted = useRef(true);
    const [randomCity, setRandomCity] = useState<CityType | null>(null);

    const getValue = (location: CityType | null, key: CityDescriptionOptions) => {
        if (!location) return "";

        switch (key) {
            case "city":
                return <Typography variant="inherit">{location.city}</Typography>;
            case "cityiso2":
                return (
                    <Typography variant="inherit">{`${location.city},${location.iso2}`}</Typography>
                );
            case "coordinates":
                return (
                    <Stack direction="row" alignItems="center" gap={1}>
                        <LocationOnIcon />
                        <Typography variant="inherit">
                            {`${parseFloat(location.lat.toString()).toFixed(2)} - 
                                    ${parseFloat(location.lng.toString()).toFixed(2)}`}
                        </Typography>
                    </Stack>
                );
            case "country":
                return <Typography variant="inherit">{location.country}</Typography>;
            case "countryiso2":
                return (
                    <Typography variant="inherit">{`${location.country},${location.iso2}`}</Typography>
                );
            case "localtime":
                return (
                    <Stack direction="row" alignItems="center" gap={1}>
                        <AccessTimeIcon />
                        <Clock
                            timezone={location.timezone}
                            format="HH:mm dd/MMM/yy"
                            variant="inherit"
                        />
                    </Stack>
                );
            case "none":
            default:
                return "";
        }
    };

    useEffect(() => {
        if (justMounted.current) {
            (async () => {
                try {
                    const city = await db.cities
                        .filter((city) => +city.population > 100_000)
                        .toArray();
                    const randomNum = Math.floor(Math.random() * (city.length + 1));
                    setRandomCity(city[randomNum]);
                } catch (err) {
                    console.error(err);
                }
            })();
        }
        justMounted.current = false;
    }, []);

    if (!randomCity) return null;

    return (
        <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={(theme) => ({
                height: "3.6rem",
                paddingInline: theme.spacing(2),
                border: `1px solid ${theme.palette.divider}`,

                svg: {
                    width: "1rem",
                    height: "1rem",
                },
            })}
        >
            <Stack direction="row" alignItems="center" gap={2}>
                {value.flag === "show" ? (
                    <Box
                        component="img"
                        width={32}
                        height={20}
                        src={`https://flagcdn.com/w40/${randomCity.iso2.toLowerCase()}.png`}
                        alt={`${randomCity.country} flag`}
                    />
                ) : null}
                <Stack>
                    <Stack direction="row" gap={1} alignItems="center">
                        {randomCity.capital === "primary" ? (
                            <LocationCityIcon fontSize="small" sx={{ mt: "2.4px" }} />
                        ) : null}
                        <ClampedTextContainer
                            variant="subtitle1"
                            sx={(theme) => ({
                                marginBottom: theme.spacing(-0.5),
                                fontWeight: theme.typography.fontWeightBold,
                                fontSize: theme.typography.h6.fontSize,
                            })}
                        >
                            {getValue(randomCity, value.topLeft)}
                        </ClampedTextContainer>
                    </Stack>
                    <Typography variant="caption">
                        {getValue(randomCity, value.bottomLeft)}
                    </Typography>
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
                    })}
                >
                    {getValue(randomCity, value.topRight)}
                    {getValue(randomCity, value.bottomRight)}
                </Box>
                <FavoriteBorderIcon style={{ width: "1.4rem", height: "1.4rem" }} />
            </Stack>
        </Stack>
    );
};

export default PreviewCity;
