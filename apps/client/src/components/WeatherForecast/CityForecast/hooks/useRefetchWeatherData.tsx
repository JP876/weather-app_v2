import { useCallback } from "react";
import { useAtomValue } from "jotai";

import useFetchWeatherData from "./useFetchWeatherData";
import useCityInfo from "./useCityInfo";
import { userSettingsAtom } from "../../../../atoms";
import useSnackbar from "../../../../hooks/useSnackbar";

const useRefetchWeatherData = () => {
    const { handleRefetch } = useFetchWeatherData();

    const cityInfo = useCityInfo();
    const userSettings = useAtomValue(userSettingsAtom);

    const { openSnackbar } = useSnackbar();

    const refetchWeatherData = useCallback(async () => {
        if (!cityInfo) {
            console.error("City info not found");
            return null;
        }

        const [error] = await handleRefetch({
            ...cityInfo,
            units: userSettings?.units || "metric",
        });

        if (error?.type === "REFETCH_LIMIT_REACHED") {
            openSnackbar({ severity: "error", message: error.msg });
        }
    }, [cityInfo, handleRefetch, openSnackbar, userSettings?.units]);

    return [refetchWeatherData] as const;
};

export default useRefetchWeatherData;
