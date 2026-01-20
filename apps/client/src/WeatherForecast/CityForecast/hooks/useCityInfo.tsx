import { useMemo } from "react";
import { useAtomValue } from "jotai";
import { useParams } from "wouter";

import { favouriteCitiesAtom } from "../../../atoms";

const useCityInfo = () => {
    const params = useParams<{ id: string }>();
    const favouriteCities = useAtomValue(favouriteCitiesAtom);

    return useMemo(() => {
        if (!params?.id || favouriteCities.length === 0) return null;
        return favouriteCities.find((city) => city.id.toString() === params.id) || null;
    }, [favouriteCities, params.id]);
};

export default useCityInfo;
