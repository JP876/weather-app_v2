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
                try {
                    const cities = await db.cities
                        .filter((city) => city.country === country)
                        .reverse()
                        .sortBy("population");

                    setFetchCitiesInfo({ data: cities, isLoading: false, error: false });
                    setCitiesByCountry(cities);
                } catch (err: unknown) {
                    const error = err as DexieError;
                    setFetchCitiesInfo({
                        data: null,
                        isLoading: false,
                        error: {
                            type: "DB",
                            name: error.name,
                            msg: error.message,
                            cause: error.cause,
                        },
                    });
                }
            })();
        }
    }, [country, setCitiesByCountry]);

    return (
        <Stack gap={2}>
            <CitySearch cities={fetchCitiesInfo.data || []} isLoading={fetchCitiesInfo.isLoading} />
            <CitiesList />
        </Stack>
    );
};

export default CitiesByCountry;
