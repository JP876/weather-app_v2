import { useCallback, useMemo } from "react";
import type { DexieError } from "dexie";
import { useSetAtom } from "jotai";

import { earthFetchInfoAtom } from "../atoms";

const useFetchEarthTexture = () => {
    const setEarthFetchInfo = useSetAtom(earthFetchInfoAtom);

    const handleFetch = useCallback(async () => {
        try {
            const res = await fetch("/api/v1/earth-texture");
            if (!res.ok) {
                throw new Error("Failed to fetch earth texture");
            }

            const data = (await res.json()) as { results: string };
            setEarthFetchInfo({ data: data.results, isLoading: false, error: false });

            return Promise.resolve(data.results);
        } catch (err: unknown) {
            const error = err as Error | DexieError;

            setEarthFetchInfo({
                data: null,
                isLoading: false,
                error: {
                    type: "API",
                    msg: error.message,
                    name: error.name,
                    cause: error.cause,
                },
            });
        }
    }, [setEarthFetchInfo]);

    return useMemo(() => ({ handleFetch }), [handleFetch]);
};

export default useFetchEarthTexture;
