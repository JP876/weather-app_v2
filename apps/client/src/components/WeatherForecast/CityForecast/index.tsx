import { memo, useEffect, useRef } from "react";
import { Divider, Stack, styled, type StackProps } from "@mui/material";
import { useAtomValue } from "jotai";

import useCityInfo from "./hooks/useCityInfo";
import CurrentMain from "./Current";
import DailyMain from "./Daily";
import HourlyMain from "./Hourly";
import { weatherFetchInfoAtom } from "../../../atoms";
import useFetchWeatherData from "./hooks/useFetchWeatherData";
import LoadingData from "../../ui/Feedback/LoadingData";

const CityForecastContainer = styled(Stack)<StackProps>(({ theme }) => ({
    gap: theme.spacing(2),
    position: "relative",
    paddingInline: theme.spacing(2),
}));

const FetchLoadingData = memo(() => {
    const { isLoading, error } = useAtomValue(weatherFetchInfoAtom);

    useEffect(() => {
        const routesContainer = document.getElementById("forecast-routes-container");

        if (routesContainer) {
            routesContainer.style.overflow = isLoading || !!error ? "hidden" : "auto";
            routesContainer.style.pointerEvents = isLoading || !!error ? "none" : "all";
        }
    }, [error, isLoading]);

    return <LoadingData isLoading={isLoading} error={!!error} />;
});

const CityForecastMain = () => {
    const cityId = useRef<string | null>(null);

    const cityInfo = useCityInfo();
    const { handleFetch } = useFetchWeatherData();

    useEffect(() => {
        if (cityInfo?.id && cityInfo?.id.toString() !== cityId.current) {
            cityId.current = cityInfo.id.toString();
            handleFetch({ id: cityInfo.id, lat: cityInfo.lat, lng: cityInfo.lng });
        }
    }, [cityInfo?.id, cityInfo?.lat, cityInfo?.lng, handleFetch]);

    return (
        <CityForecastContainer>
            <FetchLoadingData />
            <CurrentMain />
            <Divider />
            <HourlyMain />
            <Divider />
            <DailyMain />
        </CityForecastContainer>
    );
};

export default memo(CityForecastMain);
