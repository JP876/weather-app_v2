import { useEffect, useMemo, useRef } from "react";
import { Box, Tab, Tabs } from "@mui/material";
import { atom, useAtom, useAtomValue } from "jotai";
import { useLocation } from "wouter";

import { db } from "../../../utils/db";
import { citiesFetchInfoAtom, favouriteCitiesAtom } from "../../../atoms";
import withCatch from "../../../utils/withCatch";
import type { CityType } from "../../../types";
import FavouriteCitiesTabs from "./FavouriteCitiesTabs";

const a11yProps = (index: number | string) => {
    return {
        id: `tab-${index}`,
        "aria-controls": `tabpanel-${index}`,
    };
};

const isLoadingCitiesAtom = atom((get) => get(citiesFetchInfoAtom).isLoading);

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
        let width = 99.2; // first element width -> add city tab
        let left = 0; // first element position -> add city tab

        for (let i = 0; i < favouriteCities.length; i++) {
            city = { ...favouriteCities[i] };
            left = left + result[i - 1]?.width || width + 1;
            // num of chars * width of char + clear icon width + gap + 2 * padding
            width = Math.min(130, city.city.length * 8.33 + 20 + 8 + 16);

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
