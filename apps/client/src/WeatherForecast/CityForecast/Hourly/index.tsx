import { useEffect, useMemo, useRef, useState } from "react";
import { Box, Stack, Typography } from "@mui/material";
import { useAtomValue } from "jotai";
import { format } from "date-fns";

import { weatherDataAtom } from "../../../atoms";
import getWeatherIconSrc from "../../../utils/getWeatherIconSrc";
import HourlyCard from "./HourlyCard";
import HourlyChart from "./HourlyChart";

const HourlyMain = () => {
    const justMounted = useRef(true);
    const [cardsContainer, setCardsContainer] = useState<HTMLDivElement | null>(null);

    const weatherData = useAtomValue(weatherDataAtom);

    const hourlyData = useMemo(() => {
        if (!Array.isArray(weatherData?.hourly)) return [];

        return weatherData.hourly.map((d) => ({
            ...d,
            date: format(new Date(d.dt * 1_000), "HH:mm"),
            temp: d.temp.toFixed(1),
            feels_like: d.feels_like.toFixed(1),
            rain: d?.rain ? `${(d.rain["1h"] * 100).toFixed(0)}mm/h` : null,
            pop: `${(d.pop * 100).toFixed(0)}%`,
            weather: d.weather.map((el) => ({
                ...el,
                iconSrc: getWeatherIconSrc(el.icon),
            })),
        }));
    }, [weatherData]);

    useEffect(() => {
        if (!justMounted.current && weatherData?.hourly && cardsContainer) {
            setTimeout(() => {
                cardsContainer.scrollTo({ top: 0, left: 0, behavior: "smooth" });
            }, 200);
        }

        if (Array.isArray(weatherData?.hourly) && cardsContainer) {
            justMounted.current = false;
        }
    }, [weatherData, cardsContainer]);

    return (
        <Box>
            <Stack direction="row" mb={2} ml={2} gap={2}>
                <Typography variant="h5">Hourly Forecast</Typography>
            </Stack>

            <Stack
                ref={setCardsContainer}
                id="hourly-cards-container"
                gap={2}
                direction="row"
                alignItems="center"
                sx={{
                    overflowX: "scroll",
                    pb: 2.5,
                    px: 2,
                    width: "calc(var(--weather-forecast-container-width) - 1rem)",
                }}
            >
                {hourlyData.map((data) => (
                    <HourlyCard key={data.dt} data={data} />
                ))}
            </Stack>

            <HourlyChart />
        </Box>
    );
};

export default HourlyMain;
