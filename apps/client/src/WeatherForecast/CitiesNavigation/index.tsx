import { memo, useEffect } from "react";
import { Box, Stack, Tab, Tabs, Typography } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import { useAtomValue, useSetAtom } from "jotai";
import { useLocation } from "wouter";

import { favouriteCitiesAtom } from "../../atoms";
import RouterMain from "../Router";

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
    const [, navigate] = useLocation();

    const handleDeleteLocation = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        event.stopPropagation();
        setFavouriteCities((prevState) => {
            return prevState.filter((location) => location.id.toString() !== id.toString());
        });
        navigate("/", { replace: true });
    };

    return (
        <Stack direction="row" alignItems="center" gap={1}>
            <Typography
                variant="body1"
                sx={[(theme) => ({ fontSize: theme.typography.body2.fontSize })]}
            >
                {city}
            </Typography>
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

    const handleChange = (_: React.SyntheticEvent, newValue: string) => {
        navigate(newValue);
    };

    return (
        <Box sx={{ width: "100%" }}>
            <Box
                id="cities-navigation-tabs-container"
                sx={{ borderBottom: 1, borderColor: "divider" }}
            >
                <Tabs
                    value={favouriteCities.length === 0 ? "/" : path}
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
                            sx={{ alignItems: "center", p: 1 }}
                            label={<TabLabel id={el.id} city={el.city} />}
                        />
                    ))}
                </Tabs>
            </Box>

            <RouterMain />
        </Box>
    );
};

export default CitiesNavigation;
