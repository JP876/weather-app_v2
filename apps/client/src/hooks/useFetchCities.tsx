import { useCallback, useEffect, useMemo, useRef } from "react";
import { useSetAtom } from "jotai";
import { type DexieError } from "dexie";

import { citiesFetchInfoAtom, filteredCitiesAtom } from "../atoms";
import { db } from "../utils/db";
import type { CityType } from "../types";

const useFetchCities = () => {
    const controller = useRef<AbortController | null>(null);

    const setCitiesFetchInfo = useSetAtom(citiesFetchInfoAtom);
    const setFilteredCities = useSetAtom(filteredCitiesAtom);

    const handleFetch = useCallback(async () => {
        let cities = null;
        setCitiesFetchInfo((prevValue) => ({ ...prevValue, isLoading: true, error: false }));

        try {
            cities = await db.cities.reverse().sortBy("population");
        } catch (err: unknown) {
            console.error(err);
        }

        if (Array.isArray(cities) && cities.length > 0) {
            setCitiesFetchInfo({ data: cities, isLoading: false, error: false });
            setFilteredCities(cities);
            return Promise.resolve(cities);
        }

        const abortController = new AbortController();
        controller.current = abortController;

        try {
            const res = await fetch("/api/v1/worldcities", { signal: abortController.signal });
            if (!res.ok) {
                throw new Error("Failed to fetch cities data");
            }

            const data = (await res.json()) as { results: CityType[] };

            setCitiesFetchInfo({ data: data.results, isLoading: false, error: false });
            setFilteredCities(data?.results);

            await db.cities.bulkAdd(data.results);

            return Promise.resolve(data.results);
        } catch (err: unknown) {
            const error = err as Error | DexieError;

            setFilteredCities([]);
            setCitiesFetchInfo({
                data: [],
                isLoading: false,
                error: {
                    type: "API",
                    msg: error.message,
                    name: error.name,
                    cause: error.cause,
                },
            });
        }
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
