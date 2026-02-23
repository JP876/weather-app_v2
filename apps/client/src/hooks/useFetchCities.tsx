import { useCallback, useEffect, useMemo, useRef } from "react";
import { useSetAtom } from "jotai";

import { citiesFetchInfoAtom } from "../atoms";
import { db } from "../utils/db";
import type { CityType } from "../types";
import withFetch from "../utils/withFetch";
import withCatch from "../utils/withCatch";

const useFetchCities = () => {
    const controller = useRef<AbortController | null>(null);

    const setCitiesFetchInfo = useSetAtom(citiesFetchInfoAtom);

    const handleFetch = useCallback(async () => {
        setCitiesFetchInfo((prevValue) => ({ ...prevValue, isLoading: true, error: false }));
        const [, cities] = await withCatch(db.cities.reverse().sortBy("population"));

        if (Array.isArray(cities) && cities.length > 0) {
            setCitiesFetchInfo({ data: cities, isLoading: false, error: false });
            return cities;
        }

        const abortController = new AbortController();
        controller.current = abortController;

        const [err, res] = await withFetch("/api/v1/worldcities", {
            signal: abortController.signal,
        });

        if (err) {
            const { type, error } = err;
            setCitiesFetchInfo({
                data: null,
                isLoading: false,
                error: { msg: error.message, cause: error.cause, type },
            });
            return null;
        }

        const data = (await res.json()) as { results: CityType[] };

        setCitiesFetchInfo({ data: data.results, isLoading: false, error: false });
        await withCatch(db.cities.bulkAdd(data.results));

        return data.results;
    }, [setCitiesFetchInfo]);

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
