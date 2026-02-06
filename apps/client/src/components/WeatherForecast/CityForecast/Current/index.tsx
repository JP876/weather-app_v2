import { useMemo } from "react";
import { Box, Skeleton, Stack, Typography } from "@mui/material";
import { useAtomValue } from "jotai";

import useCityInfo from "../hooks/useCityInfo";
import { weatherFetchInfoAtom } from "../../../../atoms";
import WeatherIcon from "../../../WeatherIcon";
import getWeatherIconSrc from "../../../../utils/getWeatherIconSrc";

type CurrentTemperatureProps = {
    temp?: string;
    icon?: string;
};

const LocationInfo = () => {
    const cityInfo = useCityInfo();

    return (
        <Stack>
            <Stack direction="row" alignItems="center" gap={1}>
                <Typography variant="h4">{cityInfo?.city}</Typography>
            </Stack>
            <Typography variant="body2">{`${cityInfo?.country}, ${cityInfo?.iso2}`}</Typography>
        </Stack>
    );
};

const CurrentWeatherDetailsContainer = ({ label, value }: { label: string; value?: string }) => {
    const { isLoading, error } = useAtomValue(weatherFetchInfoAtom);

    return (
        <Stack>
            <Typography variant="subtitle1">{label}</Typography>
            {isLoading || !!error ? (
                <Skeleton height={32} width={100} />
            ) : (
                <Typography variant="h6">{value}</Typography>
            )}
        </Stack>
    );
};

const CurrentTemperature = ({ temp, icon }: CurrentTemperatureProps) => {
    const { isLoading, error } = useAtomValue(weatherFetchInfoAtom);

    if (isLoading || !!error) {
        return <Skeleton height={100} width={170} />;
    }

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
        <>
            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={[
                    (theme) => ({
                        top: 0,
                        position: "sticky",
                        backgroundColor: theme.palette.background.default,
                        borderBottom: `1px solid ${theme.palette.divider}`,
                        zIndex: theme.zIndex.appBar,
                    }),
                ]}
            >
                <LocationInfo />
                <CurrentTemperature
                    temp={currentWeather?.temp}
                    icon={currentWeather?.weather[0].icon}
                />
            </Stack>

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
        </>
    );
};

export default CurrentMain;
