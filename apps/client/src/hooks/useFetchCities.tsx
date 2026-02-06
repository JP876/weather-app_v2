import { useCallback, useMemo } from "react";
import { useSetAtom } from "jotai";

import { citiesFetchInfoAtom, filteredCitiesAtom } from "../atoms";
import type { CityType } from "../types";

const useFetchCities = () => {
    const setCitiesFetchInfo = useSetAtom(citiesFetchInfoAtom);
    const setFilteredCities = useSetAtom(filteredCitiesAtom);

    const fetchCities = useCallback(async () => {
        setCitiesFetchInfo((prevValue) => ({ ...prevValue, isLoading: true, error: false }));

        return Promise.all([
            fetch("/api/v1/worldcities"),
            new Promise((res) => setTimeout(res, 500)),
        ])
            .then(async ([res]) => {
                if (!res.ok) {
                    throw new Error("Failed to fetch cities data");
                }

                const data = (await res.json()) as { results: CityType[] };

                setCitiesFetchInfo({ data: data.results, isLoading: false, error: false });
                setFilteredCities(data?.results);

                return Promise.resolve(data);
            })
            .catch((err) => {
                const error = err as Error;
                setCitiesFetchInfo({ data: [], isLoading: false, error: { msg: error.message } });
                setFilteredCities([]);
            });
    }, [setCitiesFetchInfo, setFilteredCities]);

    return useMemo(() => ({ fetchCities }), [fetchCities]);
};

export default useFetchCities;
