import { useEffect, useMemo, useRef } from "react";
import { Box, Slide, Stack, Tab, Tabs } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import { atom, useAtom, useAtomValue, useSetAtom } from "jotai";
import { useLocation } from "wouter";
import { TransitionGroup } from "react-transition-group";

import { db } from "../../../utils/db";
import { citiesFetchInfoAtom, favouriteCitiesAtom, weatherFetchInfoAtom } from "../../../atoms";
import ClampedTextContainer from "../../ui/ClampedTextContainer";
import withCatch from "../../../utils/withCatch";
import type { CityType } from "../../../types";

const a11yProps = (index: number | string) => {
    return {
        id: `simple-tab-${index}`,
        "aria-controls": `simple-tabpanel-${index}`,
    };
};

type TabLabelProps = {
    id: number | string;
    city: string;
    index: number;
    prevCityId: number | string | null;
};

const TabLabel = ({ id, city, index, prevCityId }: TabLabelProps) => {
    const setFavouriteCities = useSetAtom(favouriteCitiesAtom);
    const [path, navigate] = useLocation();

    const cId = path.split("/")?.[1];

    const deleteFromFavourites = () => {
        setFavouriteCities((prevState) => {
            const nextValue = (prevState || []).filter(
                (location) => location.id.toString() !== id.toString(),
            );
            return nextValue;
        });
    };

    const handleDeleteLocation = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        event.stopPropagation();

        if (!id) {
            setFavouriteCities((prevValue) => (prevValue || []).filter((_, i) => i !== index));
            return null;
        }

        (async () => {
            await withCatch(db.weatherData.delete(+id));
            const same = id.toString() === cId;

            if (same) {
                navigate(`/${prevCityId || ""}`, { replace: true });
                setTimeout(deleteFromFavourites, 200);
            } else {
                deleteFromFavourites();
            }
        })();
    };

    return (
        <Stack direction="row" alignItems="center" gap={1}>
            <ClampedTextContainer variant="body2" sx={{ maxWidth: "5.4rem" }}>
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
};

const isLoadingCitiesAtom = atom((get) => get(citiesFetchInfoAtom).isLoading);
const isLoadingWeatherAtom = atom((get) => get(weatherFetchInfoAtom).isLoading);

type LinkTabProps = {
    label?: string;
    selected?: string;
};

const FavouriteCitiesTabs = (props: LinkTabProps) => {
    const isLoadingWeather = useAtomValue(isLoadingWeatherAtom);
    const favouriteCities = useAtomValue(favouriteCitiesAtom);

    const [path] = useLocation();
    const cId = path.split("/")?.[1];

    const cities = (favouriteCities || []).map((el) => {
        const selected = el?.id.toString() === cId;
        return { tabProps: { ...props, ...a11yProps(el?.id), selected }, ...el };
    });

    return (
        <TransitionGroup>
            {(cities || []).map((el, index) => (
                <Slide key={el.id}>
                    <Tab
                        disableRipple
                        sx={{ alignItems: "center", p: 1 }}
                        {...el.tabProps}
                        value={`/${el.id}`}
                        disabled={isLoadingWeather === "INITIAL"}
                        label={
                            <TabLabel
                                id={el.id}
                                city={el.city}
                                index={index}
                                prevCityId={favouriteCities?.[index - 1]?.id || null}
                            />
                        }
                    />
                </Slide>
            ))}
        </TransitionGroup>
    );
};

const CitiesNavigation = () => {
    const justMounted = useRef(true);

    const isCitiesLoading = useAtomValue(isLoadingCitiesAtom);
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

    const favCities = useMemo(() => {
        if (!Array.isArray(favouriteCities) || favouriteCities.length === 0) return [];

        let result: (CityType & { left: number; width: number })[] = [];
        let city: CityType | null = null;
        let width = 100; // first element width
        let left = 0;

        for (let i = 0; i < favouriteCities.length; i++) {
            city = { ...favouriteCities[i] };
            left = left + result[i - 1]?.width || width;
            // num of chars * width of char + clear icon width + gap + 2 * padding
            width = city.city.length * 8.33 + 20 + 8 + 16;

            result = [...result, { ...city, left, width }];
        }

        return result;
    }, [favouriteCities]);

    const handleChange = (_: React.SyntheticEvent, newValue: string) => {
        navigate(newValue, { transition: true });
    };

    useEffect(() => {
        if (!isCitiesLoading && Array.isArray(favouriteCities) && cId && justMounted.current) {
            if (isFavourite === false) {
                (async () => {
                    const [error, city] = await withCatch(
                        db.cities.where("id").equals(+cId).toArray(),
                    );

                    if (!error && city[0]?.id) {
                        setFavouriteCities((prevValue) => [...(prevValue || []), { ...city[0] }]);
                    } else {
                        navigate("/", { replace: true });
                    }
                })();
            }
            justMounted.current = false;
        }
    }, [cId, favouriteCities, isCitiesLoading, isFavourite, navigate, setFavouriteCities]);

    return (
        <Box
            id="cities-navigation-tabs-container"
            sx={{ borderBottom: 1, borderColor: "divider", position: "relative" }}
        >
            <Tabs
                value={value}
                onChange={handleChange}
                aria-label="cities tab navigation"
                role="navigation"
                scrollButtons="auto"
                variant="scrollable"
            >
                <Tab disableRipple label="Add city" value="/" {...a11yProps("/")} />
                {favCities.map((el) => (
                    <Tab
                        key={el.city}
                        value={`/${el.id}`}
                        sx={{
                            position: "absolute",
                            left: el.left,
                            width: el.width,
                            zIndex: -1,
                            pointerEvents: "none",
                        }}
                    />
                ))}

                <FavouriteCitiesTabs />
            </Tabs>
        </Box>
    );
};

export default CitiesNavigation;
