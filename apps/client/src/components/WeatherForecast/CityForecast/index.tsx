import { lazy, memo, Suspense, useCallback, useEffect, useRef } from "react";
import { Button, Divider, Stack, styled, type StackProps } from "@mui/material";
import ReplayIcon from "@mui/icons-material/Replay";
import { useAtomValue } from "jotai";

import useCityInfo from "./hooks/useCityInfo";
import { userSettingsAtom, weatherFetchInfoAtom } from "../../../atoms";
import useFetchWeatherData from "./hooks/useFetchWeatherData";
import LoadingData from "../../ui/Feedback/LoadingData";
import { db } from "../../../utils/db";
import LoadingRoute from "../../ui/Feedback/LoadingRoute";
import useRefetchWeatherData from "./hooks/useRefetchWeatherData";

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

const FetchLoadingData = memo(({ children }: { children: React.ReactNode }) => {
    const { isLoading, error } = useAtomValue(weatherFetchInfoAtom);
    const [refetchWeatherData] = useRefetchWeatherData();

    const errorType = (() => (error ? error.type : null))();

    const renderActions = () => {
        if (errorType === "NETWORK_ERROR") {
            return null;
        }

        return (
            <Stack direction="row" justifyContent="center">
                <Button
                    color="inherit"
                    variant="outlined"
                    startIcon={<ReplayIcon />}
                    loading={isLoading === "REFETCH"}
                    onClick={refetchWeatherData}
                >
                    Retry
                </Button>
            </Stack>
        );
    };

    return (
        <CityForecastContainer
            sx={{
                ...((isLoading === "INITIAL" ||
                    errorType === "API_ERROR" ||
                    errorType === "NETWORK_ERROR") && {
                    overflow: "hidden",
                }),
            }}
        >
            <LoadingData
                isLoading={isLoading === "INITIAL"}
                error={errorType === "API_ERROR" || errorType === "NETWORK_ERROR"}
                renderActions={renderActions}
                message={
                    errorType === "NETWORK_ERROR"
                        ? "Looks like you're not connected. Try again once you're online."
                        : ""
                }
            />
            {children}
        </CityForecastContainer>
    );
});

const CityForecastMain = () => {
    const userSettings = useAtomValue(userSettingsAtom);
    const unitsRef = useRef(userSettings.units);

    const cityInfo = useCityInfo();

    const { handleFetch } = useFetchWeatherData();
    const [refetchWeatherData] = useRefetchWeatherData();

    const clearWeatherDataTable = useCallback(async () => {
        try {
            await db.weatherData.clear();
        } catch (err) {
            console.error(err);
        }
    }, []);

    useEffect(() => {
        if (cityInfo?.id || userSettings?.units !== unitsRef.current) {
            if (userSettings?.units !== unitsRef.current) {
                clearWeatherDataTable();
            }
            unitsRef.current = userSettings?.units;

            if (cityInfo?.id) {
                handleFetch({
                    id: cityInfo.id,
                    lat: cityInfo.lat,
                    lng: cityInfo.lng,
                    units: userSettings?.units || "metric",
                });
            }
        }
    }, [
        cityInfo?.id,
        cityInfo?.lat,
        cityInfo?.lng,
        userSettings?.units,
        clearWeatherDataTable,
        handleFetch,
    ]);

    useEffect(() => {
        const controller = new AbortController();
        const handleVisibilityChange = () => {
            if (document.visibilityState === "visible") {
                refetchWeatherData();
            }
        };

        window.addEventListener("focus", handleVisibilityChange, {
            signal: controller.signal,
        });
        return () => {
            controller.abort();
        };
    }, [refetchWeatherData]);

    return (
        <FetchLoadingData>
            <Suspense fallback={<LoadingRoute />}>
                <CurrentMain />
                <Divider />
                <HourlyMain />
                <Divider />
                <DailyMain />
            </Suspense>
        </FetchLoadingData>
    );
};

export default CityForecastMain;
