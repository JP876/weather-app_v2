import { memo } from "react";
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
    const [path, navigate] = useLocation();

    const deleteDataFromDB = async (id: number) => {
        try {
            await db.weatherData.delete(id);
        } catch (err: unknown) {
            console.error(err);
        }
    };

    const handleDeleteLocation = async (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        event.stopPropagation();
        let nextValue: CityType[] = [];

        setFavouriteCities((prevState) => {
            nextValue = prevState.filter((location) => location.id.toString() !== id.toString());
            return nextValue;
        });
        await deleteDataFromDB(+id);

        const p = path.split("/");
        const cId = p.length === 2 ? p[1] : null;

        if (id !== cId) return;

        const nextPath = nextValue.length > 0 ? nextValue[nextValue.length - 1].id : "";

        navigate(`/${nextPath}`, { replace: true });
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

    const { isLoading } = useAtomValue(weatherFetchInfoAtom);

    const value = (() => {
        if (favouriteCities.length === 0) return "/";
        const cId = path.split("/")?.[1];
        if (!cId) return "/";
        const isFavourite = favouriteCities.some((city) => city.id.toString() === cId);
        return isFavourite ? path : "/";
    })();

    const handleChange = (_: React.SyntheticEvent, newValue: string) => {
        navigate(newValue, { transition: true });
    };

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
