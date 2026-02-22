import { useCallback, useEffect, useMemo, useRef } from "react";
import { useSetAtom } from "jotai";

import { citiesFetchInfoAtom, filteredCitiesAtom } from "../atoms";
import { db } from "../utils/db";
import type { CityType } from "../types";
import withFetch from "../utils/withFetch";
import withCatch from "../utils/withCatch";

const useFetchCities = () => {
    const controller = useRef<AbortController | null>(null);

    const setCitiesFetchInfo = useSetAtom(citiesFetchInfoAtom);
    const setFilteredCities = useSetAtom(filteredCitiesAtom);

    const handleFetch = useCallback(async () => {
        setCitiesFetchInfo((prevValue) => ({ ...prevValue, isLoading: true, error: false }));
        const [, cities] = await withCatch(db.cities.reverse().sortBy("population"));

        if (Array.isArray(cities) && cities.length > 0) {
            setCitiesFetchInfo({ data: cities, isLoading: false, error: false });
            setFilteredCities(cities);
            return cities;
        }

        const abortController = new AbortController();
        controller.current = abortController;

        const [error, res] = await withFetch("/api/v1/worldcities", {
            signal: abortController.signal,
        });

        if (error) {
            setFilteredCities([]);
            setCitiesFetchInfo({
                data: null,
                isLoading: false,
                error: { msg: error.message, name: error.name, cause: error.cause },
            });
            return null;
        }

        const data = (await res.json()) as { results: CityType[] };

        setCitiesFetchInfo({ data: data.results, isLoading: false, error: false });
        setFilteredCities(data?.results);

        await db.cities.bulkAdd(data.results);
        return data.results;
    }, [setCitiesFetchInfo, setFilteredCities]);

    useEffect(() => {
        return () => {
            if (controller.current) {
                controller.current.abort();
            }
        };
    }, []);

    return useMemo(() => ({ handleFetch }), [handleFetch]);
};

export default useFetchCities;
