import { lazy, memo, Suspense, useCallback, useEffect, useRef } from "react";
import { Divider, Stack, styled, type StackProps } from "@mui/material";
import { useAtomValue } from "jotai";

import useCityInfo from "./hooks/useCityInfo";

import { userSettingsAtom, weatherFetchInfoAtom } from "../../../atoms";
import useFetchWeatherData from "./hooks/useFetchWeatherData";
import LoadingData from "../../ui/Feedback/LoadingData";
import { db } from "../../../utils/db";
import LoadingRoute from "../../ui/Feedback/LoadingRoute";

const CurrentMain = lazy(() => import("./Current"));
const DailyMain = lazy(() => import("./Daily"));
const HourlyMain = lazy(() => import("./Hourly"));

const CityForecastContainer = styled(Stack)<StackProps>(({ theme }) => ({
    height: "100%",
    gap: theme.spacing(2),
    paddingInline: theme.spacing(2),
    overflow: "auto",
    scrollbarWidth: "thin",
}));

const FetchLoadingData = memo(() => {
    const { isLoading, error } = useAtomValue(weatherFetchInfoAtom);

    const errorType = (() => (error ? error.type : null))();

    useEffect(() => {
        const routesContainer = document.getElementById("forecast-routes-container");
        const err = errorType === "API_ERROR" || errorType === "NETWORK_ERROR";

        if (routesContainer) {
            routesContainer.style.overflow = isLoading || err ? "hidden" : "auto";
            routesContainer.style.pointerEvents = isLoading || err ? "none" : "all";
        }
    }, [errorType, isLoading]);

    return (
        <LoadingData
            isLoading={isLoading === "INITIAL"}
            error={errorType === "API_ERROR" || errorType === "NETWORK_ERROR"}
        />
    );
});

const CityForecastMain = () => {
    const userSettings = useAtomValue(userSettingsAtom);

    const unitsRef = useRef(userSettings.units);
    const cityId = useRef<string | null>(null);

    const cityInfo = useCityInfo();
    const { handleFetch } = useFetchWeatherData();

    const clearWeatherDataTable = useCallback(async () => {
        try {
            await db.weatherData.clear();
        } catch (err) {
            console.error(err);
        }
    }, []);

    useEffect(() => {
        if (
            cityInfo?.id &&
            (cityInfo?.id.toString() !== cityId.current || userSettings?.units !== unitsRef.current)
        ) {
            if (userSettings?.units !== unitsRef.current) {
                clearWeatherDataTable();
            }

            cityId.current = cityInfo.id.toString();
            unitsRef.current = userSettings?.units;

            handleFetch({
                id: cityInfo.id,
                lat: cityInfo.lat,
                lng: cityInfo.lng,
                units: userSettings?.units || "metric",
            });
        }
    }, [
        cityInfo?.id,
        cityInfo?.lat,
        cityInfo?.lng,
        userSettings?.units,
        clearWeatherDataTable,
        handleFetch,
    ]);

    return (
        <CityForecastContainer>
            <FetchLoadingData />
            <Suspense fallback={<LoadingRoute />}>
                <CurrentMain />
                <Divider />
                <HourlyMain />
                <Divider />
                <DailyMain />
            </Suspense>
        </CityForecastContainer>
    );
};

export default memo(CityForecastMain);
