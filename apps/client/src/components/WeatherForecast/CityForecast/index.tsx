import { useEffect, useRef } from "react";
import { Divider, Stack, styled, type StackProps } from "@mui/material";
import { useAtomValue } from "jotai";
import { useLocation } from "wouter";

import useCityInfo from "./hooks/useCityInfo";
import CurrentMain from "./Current";
import DailyMain from "./Daily";
import HourlyMain from "./Hourly";
import LoadingData from "../../Feedback/LoadingData";
import { weatherFetchInfoAtom } from "../../../atoms";
import useSnackbar from "../../../hooks/useSnackbar";
import useFetchWeatherData from "./hooks/useFetchWeatherData";

const CityForecastContainer = styled(Stack)<StackProps>(({ theme }) => ({
    gap: theme.spacing(2),
    position: "relative",
    paddingInline: theme.spacing(2),
}));

const FetchLoadingData = () => {
    const { isLoading, error } = useAtomValue(weatherFetchInfoAtom);
    return <LoadingData isLoading={isLoading} error={!!error} />;
};

const CityForecastMain = () => {
    const cityId = useRef<string | null>(null);
    const [, navigate] = useLocation();

    const cityInfo = useCityInfo();
    const { openSnackbar } = useSnackbar();

    const { handleFetch } = useFetchWeatherData();

    useEffect(() => {
        if (cityInfo) {
            if (cityInfo.id.toString() !== cityId.current) {
                cityId.current = cityInfo.id.toString();
                handleFetch(cityInfo);
            }
        } else {
            navigate("/", { replace: true });

            const message = `Hmm… we couldn't load the city details this time.`;
            openSnackbar({ message, severity: "error" });
        }
    }, [cityInfo, handleFetch, navigate, openSnackbar]);

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

export default CityForecastMain;
