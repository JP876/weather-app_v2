import { memo, useEffect, useRef } from "react";
import { Box, Stack, Tab, Tabs } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useLocation } from "wouter";

import { db } from "../../../utils/db";
import { citiesFetchInfoAtom, favouriteCitiesAtom, weatherFetchInfoAtom } from "../../../atoms";
import ClampedTextContainer from "../../ui/ClampedTextContainer";
import withCatch from "../../../utils/withCatch";
import type { CityType } from "../../../types";

const a11yProps = (index: number) => {
    return {
        id: `simple-tab-${index}`,
        "aria-controls": `simple-tabpanel-${index}`,
    };
};

type TabLabelProps = {
    id: number | string;
    city: string;
    index: number;
};

const TabLabel = memo(({ id, city, index }: TabLabelProps) => {
    const setFavouriteCities = useSetAtom(favouriteCitiesAtom);

    const handleDeleteLocation = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        event.stopPropagation();

        if (!id) {
            setFavouriteCities((prevValue) => (prevValue || []).filter((_, i) => i !== index));
            return null;
        }

        (async () => {
            await withCatch(db.weatherData.delete(+id));

            setFavouriteCities((prevState) => {
                const nextValue = (prevState || []).filter(
                    (location) => location.id.toString() !== id.toString(),
                );

                const event = new CustomEvent<CityType[]>("update-path", { detail: nextValue });
                window.document.dispatchEvent(event);

                return nextValue;
            });
        })();
    };

    return (
        <Stack direction="row" alignItems="center" gap={1}>
            <ClampedTextContainer
                variant="body1"
                sx={[
                    (theme) => ({
                        fontSize: theme.typography.body2.fontSize,
                        maxWidth: "5.4rem",
                    }),
                ]}
            >
                {city}
            </ClampedTextContainer>
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
    const justMounted = useRef(true);

    const { isLoading: isCitiesLoading } = useAtomValue(citiesFetchInfoAtom);
    const { isLoading } = useAtomValue(weatherFetchInfoAtom);

    const [favouriteCities, setFavouriteCities] = useAtom(favouriteCitiesAtom);

    const [path, navigate] = useLocation();

    const cId = path.split("/")?.[1];
    const isFavourite = (() => {
        if (!Array.isArray(favouriteCities)) return null;
        return favouriteCities.some((city) => {
            return city?.id ? city?.id?.toString() === cId : false;
        });
    })();

    const value = (() => {
        if (
            !Array.isArray(favouriteCities) ||
            favouriteCities.length === 0 ||
            !cId ||
            !isFavourite
        ) {
            return "/";
        }
        return path;
    })();

    const handleChange = (_: React.SyntheticEvent, newValue: string) => {
        navigate(newValue, { transition: true });
    };

    useEffect(() => {
        const controller = new AbortController();

        const updatePath = (event: CustomEventInit<CityType[]>) => {
            if (Array.isArray(event.detail)) {
                const nextPath =
                    event.detail.length > 0 ? event.detail[event.detail.length - 1].id : "";
                navigate(`/${nextPath}`, { replace: true });
            }
        };

        document.addEventListener("update-path", updatePath, { signal: controller.signal });
        return () => {
            controller.abort();
        };
    }, [navigate]);

    useEffect(() => {
        if (
            !isCitiesLoading &&
            Array.isArray(favouriteCities) &&
            cId &&
            isFavourite === false &&
            justMounted.current
        ) {
            (async () => {
                justMounted.current = false;
                const [error, city] = await withCatch(db.cities.where("id").equals(+cId).toArray());

                if (!error && city[0]?.id) {
                    setFavouriteCities((prevValue) => [...(prevValue || []), { ...city[0] }]);
                } else {
                    navigate("/", { replace: true });
                }
            })();
        }
    }, [cId, favouriteCities, isCitiesLoading, isFavourite, navigate, setFavouriteCities]);

    return (
        <Box id="cities-navigation-tabs-container" sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
                value={value || "/"}
                onChange={handleChange}
                aria-label="cities tab navigation"
                role="navigation"
                scrollButtons="auto"
                variant="scrollable"
            >
                <Tab label="Add city" value="/" {...a11yProps(0)} />
                {(favouriteCities || []).map((el, index) => (
                    <Tab
                        key={el.id}
                        value={`/${el.id}`}
                        disableRipple
                        disabled={isLoading === "INITIAL"}
                        sx={{ alignItems: "center", p: 1 }}
                        label={<TabLabel id={el.id} city={el.city} index={index} />}
                    />
                ))}
            </Tabs>
        </Box>
    );
};

export default CitiesNavigation;
