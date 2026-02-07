import { memo, useEffect } from "react";
import { Box, Stack, Tab, Tabs } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import { useAtomValue, useSetAtom } from "jotai";
import { useLocation } from "wouter";

import { favouriteCitiesAtom, weatherFetchInfoAtom } from "../../../atoms";
import type { CityType } from "../../../types";
import { ClampedText } from "../../styledComps";
import { db } from "../../../utils/db";

const a11yProps = (index: number) => {
    return {
        id: `simple-tab-${index}`,
        "aria-controls": `simple-tabpanel-${index}`,
    };
};

type TabLabelProps = {
    id: number | string;
    city: string;
};

const TabLabel = memo(({ id, city }: TabLabelProps) => {
    const setFavouriteCities = useSetAtom(favouriteCitiesAtom);

    const handleDeleteLocation = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        event.stopPropagation();
        let nextValue: CityType[] = [];

        setFavouriteCities((prevState) => {
            db.weatherData.delete(+id);
            nextValue = (prevState || []).filter(
                (location) => location.id.toString() !== id.toString(),
            );
            return nextValue;
        });
    };

    return (
        <Stack direction="row" alignItems="center" gap={1}>
            <ClampedText
                variant="body1"
                sx={[
                    (theme) => ({
                        fontSize: theme.typography.body2.fontSize,
                        maxWidth: "5.4rem",
                    }),
                ]}
            >
                {city}
            </ClampedText>
            <Box
                onClick={handleDeleteLocation}
                sx={[
                    (theme) => ({
                        "& svg": {
                            "&:hover": { color: theme.palette.grey[800] },
                            color: theme.palette.grey[600],
                            transition: theme.transitions.create(["color"]),
                        },
                    }),
                ]}
            >
                <ClearIcon fontSize="small" />
            </Box>
        </Stack>
    );
});

const CitiesNavigation = () => {
    const favouriteCities = useAtomValue(favouriteCitiesAtom);
    const [path, navigate] = useLocation();

    const cId = path.split("/")?.[1];
    const isFavourite = (() => {
        if (!Array.isArray(favouriteCities)) return null;
        return favouriteCities.some((city) => city.id.toString() === cId);
    })();

    const { isLoading } = useAtomValue(weatherFetchInfoAtom);

    const value = (() => {
        if (!Array.isArray(favouriteCities)) return null;
        if (favouriteCities.length === 0 || !cId || !isFavourite) return "/";
        return path;
    })();

    const handleChange = (_: React.SyntheticEvent, newValue: string) => {
        navigate(newValue, { transition: true });
    };

    useEffect(() => {
        if (Array.isArray(favouriteCities) && cId && isFavourite === false) {
            const nextPath =
                favouriteCities.length > 0 ? favouriteCities[favouriteCities.length - 1].id : "";
            navigate(`/${nextPath}`, { replace: true });
        }
    }, [cId, favouriteCities, isFavourite, navigate]);

    if (favouriteCities === null) return null;

    return (
        <Box id="cities-navigation-tabs-container" sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
                value={value}
                onChange={handleChange}
                aria-label="cities tab navigation"
                role="navigation"
                scrollButtons="auto"
                variant="scrollable"
            >
                <Tab label="Add city" value="/" {...a11yProps(0)} />
                {favouriteCities.map((el) => (
                    <Tab
                        key={el.id}
                        value={`/${el.id}`}
                        disableRipple
                        disabled={isLoading}
                        sx={{ alignItems: "center", p: 1 }}
                        label={<TabLabel id={el.id} city={el.city} />}
                    />
                ))}
            </Tabs>
        </Box>
    );
};

export default CitiesNavigation;
