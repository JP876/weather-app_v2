import { memo, useMemo } from "react";
import { Box, Skeleton, Stack, styled, Typography, type StackProps } from "@mui/material";
import { useAtomValue } from "jotai";

import useCityInfo from "../hooks/useCityInfo";
import { weatherFetchInfoAtom } from "../../../../atoms";
import getWeatherIconSrc from "../../../../utils/getWeatherIconSrc";
import WeatherIcon from "../../../ui/WeatherIcon";
import ClampedTextContainer from "../../../ui/ClampedTextContainer";

type CurrentTemperatureProps = {
    temp?: string;
    icon?: string;
};

const CurrentTemperatureContainer = styled(Stack)<StackProps>(({ theme }) => ({
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    top: 0,
    position: "sticky",
    backgroundColor: theme.palette.background.default,
    // background: "rgba(255, 255, 255, 0.8)",
    // backdropFilter: `blur(${theme.spacing(8)})`,
    // WebkitBackdropFilter: `blur(${theme.spacing(4)})`,
    borderBottom: `1px solid ${theme.palette.divider}`,
    zIndex: theme.zIndex.appBar,
}));

const LocationInfo = () => {
    const cityInfo = useCityInfo();

    return (
        <Stack>
            <Stack direction="row" alignItems="center" gap={1}>
                <ClampedTextContainer variant="h4">{cityInfo?.city}</ClampedTextContainer>
            </Stack>
            <ClampedTextContainer variant="body2">
                {`${cityInfo?.country}, ${cityInfo?.iso2}`}
            </ClampedTextContainer>
        </Stack>
    );
};

const CurrentWeatherDetailsContainer = ({ label, value }: { label: string; value?: string }) => {
    return (
        <Stack>
            <Typography variant="subtitle1">{label}</Typography>
            <Typography variant="h6">{value}</Typography>
        </Stack>
    );
};

const CurrentTemperature = ({ temp, icon }: CurrentTemperatureProps) => {
    return (
        <Stack direction="row" alignItems="center" gap={3.2}>
            <Typography variant="h5">{`${temp}\u00B0C`}</Typography>
            {icon ? (
                <Box my={2.5}>
                    <WeatherIcon code={icon} size={60} />
                </Box>
            ) : null}
        </Stack>
    );
};

const currentInfo = ["Feels like", "Humidity", "Current UV index", "Cloudiness"];

const LoadingDataContainer = ({
    hasData,
    children,
}: {
    hasData: boolean;
    children: React.ReactNode;
}) => {
    const { isLoading, error } = useAtomValue(weatherFetchInfoAtom);

    if (!hasData || isLoading || !!error) {
        return (
            <>
                <CurrentTemperatureContainer>
                    <LocationInfo />
                    <Skeleton height={100} width={170} />
                </CurrentTemperatureContainer>
                <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1 }}>
                    {currentInfo.map((value, index) => (
                        <Stack key={index}>
                            <Typography variant="subtitle1">{value}</Typography>
                            <Skeleton height={32} width={100} />
                        </Stack>
                    ))}
                </Box>
            </>
        );
    }
    return children;
};

const CurrentMain = () => {
    const { data: weatherData } = useAtomValue(weatherFetchInfoAtom);

    const currentWeather = useMemo(() => {
        if (!weatherData?.current) return null;
        const w = weatherData.current;
        return {
            ...w,
            temp: w.temp.toFixed(1),
            weather: w.weather.map((el) => ({ ...el, iconSrc: getWeatherIconSrc(el.icon) })),
        };
    }, [weatherData]);

    return (
        <LoadingDataContainer hasData={!!currentWeather}>
            <CurrentTemperatureContainer>
                <LocationInfo />
                <CurrentTemperature
                    temp={currentWeather?.temp}
                    icon={currentWeather?.weather[0].icon}
                />
            </CurrentTemperatureContainer>

            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1 }}>
                <CurrentWeatherDetailsContainer
                    label="Feels like"
                    value={`${currentWeather?.feels_like.toFixed(1)}\u00B0C`}
                />
                <CurrentWeatherDetailsContainer
                    label="Humidity"
                    value={`${currentWeather?.humidity}%`}
                />
                <CurrentWeatherDetailsContainer
                    label="Current UV index"
                    value={`${currentWeather?.uvi}`}
                />
                <CurrentWeatherDetailsContainer
                    label="Cloudiness"
                    value={`${currentWeather?.clouds}%`}
                />
            </Box>
        </LoadingDataContainer>
    );
};

export default memo(CurrentMain);
