import { useEffect, useState } from "react";
import { Stack } from "@mui/material";
import { useSetAtom } from "jotai";
import type { DexieError } from "dexie";

import { db } from "../../../../utils/db";
import CitiesList from "./CitiesList";
import { citiesByCountry } from "../../../../atoms";
import type { FetchInfoType } from "../../../../atoms/types";
import type { CityType } from "../../../../types";
import CitySearch from "./CitySearch";
import withCatch from "../../../../utils/withCatch";

const CitiesByCountry = ({ country }: { country: string }) => {
    const setCitiesByCountry = useSetAtom(citiesByCountry);

    const [fetchCitiesInfo, setFetchCitiesInfo] = useState<FetchInfoType<CityType[]>>({
        data: null,
        isLoading: false,
        error: false,
    });

    useEffect(() => {
        if (country) {
            (async () => {
                setFetchCitiesInfo((prevValue) => ({
                    ...prevValue,
                    error: false,
                    isLoading: true,
                }));

                const [error, cities] = await withCatch<CityType[], DexieError>(
                    db.cities
                        .filter((city) => city.country === country)
                        .reverse()
                        .sortBy("population"),
                );

                if (error) {
                    setFetchCitiesInfo({
                        data: null,
                        isLoading: false,
                        error: { type: "INDEXED_DB_ERROR", msg: error.message, cause: error.cause },
                    });
                    return;
                }

                setFetchCitiesInfo({ data: cities, isLoading: false, error: false });
                setCitiesByCountry(cities);
            })();
        }
    }, [country, setCitiesByCountry]);

    useEffect(() => {
        return () => {
            setCitiesByCountry(null);
        };
    }, [setCitiesByCountry]);

    return (
        <Stack gap={2}>
            <CitySearch cities={fetchCitiesInfo.data || []} isLoading={fetchCitiesInfo.isLoading} />
            <CitiesList />
        </Stack>
    );
};

export default CitiesByCountry;
