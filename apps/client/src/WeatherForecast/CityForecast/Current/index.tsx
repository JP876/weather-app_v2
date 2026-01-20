import { useMemo } from "react";
import { Box, Stack, Typography } from "@mui/material";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import { useAtomValue } from "jotai";

import { weatherDataAtom } from "../../../atoms";
import useCityInfo from "../hooks/useCityInfo";
import getWeatherIconSrc from "../../../utils/getWeatherIconSrc";

const LocationInfo = () => {
    const cityInfo = useCityInfo();

    return (
        <Stack>
            <Stack direction="row" alignItems="center" gap={1}>
                <LocationCityIcon color="primary" />
                <Typography variant="h4">{cityInfo?.city}</Typography>
            </Stack>
            <Typography variant="body2">{`${cityInfo?.country}, ${cityInfo?.iso2}`}</Typography>
        </Stack>
    );
};

const CurrentWeatherDetailsContainer = ({ label, value }: { label: string; value: string }) => {
    return (
        <Stack>
            <Typography variant="subtitle1">{label}</Typography>
            <Typography variant="h6">{value}</Typography>
        </Stack>
    );
};

const CurrentMain = () => {
    const weatherData = useAtomValue(weatherDataAtom);

    const currentWeather = useMemo(() => {
        if (!weatherData?.current) return null;
        const w = weatherData.current;
        return {
            ...w,
            temp: w.temp.toFixed(1),
            weather: w.weather.map((el) => ({ ...el, iconSrc: getWeatherIconSrc(el.icon) })),
        };
    }, [weatherData]);

    if (currentWeather === null) {
        return null;
    }

    return (
        <>
            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={[
                    (theme) => ({
                        px: 2,
                        top: 0,
                        position: "sticky",
                        backgroundColor: theme.palette.background.default,
                        borderBottom: `1px solid ${theme.palette.divider}`,
                        zIndex: theme.zIndex.appBar,
                    }),
                ]}
            >
                <LocationInfo />
                <Stack direction="row" alignItems="center">
                    <Typography variant="h5">{`${currentWeather.temp} \u00B0C`}</Typography>
                    <Box
                        component="img"
                        src={currentWeather.weather[0].iconSrc}
                        alt={currentWeather.weather[0].description}
                        width={100}
                        height={100}
                    />
                </Stack>
            </Stack>

            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", mx: 2, gap: 1 }}>
                <CurrentWeatherDetailsContainer
                    label="Feels like"
                    value={`${currentWeather.feels_like.toFixed(1)} \u00B0C`}
                />
                <CurrentWeatherDetailsContainer
                    label="Humidity"
                    value={`${currentWeather.humidity} %`}
                />
                <CurrentWeatherDetailsContainer
                    label="Current UV index"
                    value={`${currentWeather.uvi}`}
                />
                <CurrentWeatherDetailsContainer
                    label="Cloudiness"
                    value={`${currentWeather.clouds} %`}
                />
            </Box>
        </>
    );
};

export default CurrentMain;
