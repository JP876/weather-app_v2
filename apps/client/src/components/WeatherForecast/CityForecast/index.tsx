import { memo, useEffect, useRef } from "react";
import { Divider, Stack, styled, type StackProps } from "@mui/material";
import { useAtomValue } from "jotai";

import useCityInfo from "./hooks/useCityInfo";
import CurrentMain from "./Current";
import DailyMain from "./Daily";
import HourlyMain from "./Hourly";
import LoadingData from "../../Feedback/LoadingData";
import { weatherFetchInfoAtom } from "../../../atoms";
import useFetchWeatherData from "./hooks/useFetchWeatherData";

const CityForecastContainer = styled(Stack)<StackProps>(({ theme }) => ({
    gap: theme.spacing(2),
    position: "relative",
    paddingInline: theme.spacing(2),
}));

const FetchLoadingData = memo(() => {
    const { isLoading, error } = useAtomValue(weatherFetchInfoAtom);
    return <LoadingData isLoading={isLoading} error={!!error} />;
});

const CityForecastMain = () => {
    const cityId = useRef<string | null>(null);

    const cityInfo = useCityInfo();
    const { handleFetch } = useFetchWeatherData();

    useEffect(() => {
        if (cityInfo && cityInfo.id.toString() !== cityId.current) {
            cityId.current = cityInfo.id.toString();
            handleFetch(cityInfo);
        }
    }, [cityInfo, handleFetch]);

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
