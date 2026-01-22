import { useEffect, useMemo, useRef, useState } from "react";
import { Box, Button, Collapse, Skeleton, Stack, Typography } from "@mui/material";
import InfoOutlineIcon from "@mui/icons-material/InfoOutline";
import { useAtomValue } from "jotai";
import { format } from "date-fns";

import { userSettingsAtom, weatherFetchInfoAtom } from "../../../atoms";
import getWeatherIconSrc from "../../../utils/getWeatherIconSrc";
import HourlyCard, { HourlyCardContainer } from "./HourlyCard";
import HourlyChart from "./HourlyChart";
import UserSettings from "./UserSettings";

const SkeletonCard = ({ isLoading, error }: { isLoading: boolean; error: boolean }) => {
    return (
        <HourlyCardContainer isLoading={isLoading} error={error}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Skeleton width={42} height={24} />
                <Skeleton width={42} height={24} />
            </Stack>

            <Stack direction="row" justifyContent="center" mb={2}>
                <Stack alignItems="center">
                    <Skeleton variant="circular" width={64} height={64} sx={{ my: 2 }} />
                </Stack>
            </Stack>

            <Stack direction="row" justifyContent="center" alignItems="center">
                <Button
                    size="small"
                    variant="outlined"
                    startIcon={<InfoOutlineIcon fontSize="small" />}
                    disabled
                >
                    Details
                </Button>
            </Stack>
        </HourlyCardContainer>
    );
};

const HourlyCardsContainer = () => {
    const justMounted = useRef(true);
    const [cardsContainer, setCardsContainer] = useState<HTMLDivElement | null>(null);

    const { isLoading, data: weatherData, error } = useAtomValue(weatherFetchInfoAtom);

    const hourlyData = useMemo(() => {
        if (!Array.isArray(weatherData?.hourly)) return [];

        return weatherData.hourly
            .filter((_, i) => i % 2 === 0)
            .map((d) => ({
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
        <Stack
            ref={setCardsContainer}
            id="hourly-cards-container"
            gap={2}
            direction="row"
            alignItems="center"
            sx={{ overflowX: "scroll", pb: 2.5, px: 2, width: "calc(100% - 1rem)" }}
        >
            {isLoading || !!error
                ? Array.from({ length: 24 }).map((_, index) => (
                      <SkeletonCard key={index} isLoading={isLoading} error={!!error} />
                  ))
                : hourlyData.map((data) => <HourlyCard key={data.dt} data={data} />)}
        </Stack>
    );
};

const CardsContainer = ({ children }: { children: React.ReactNode }) => {
    const settings = useAtomValue(userSettingsAtom);
    return <Collapse in={settings.hourly.cards}>{children}</Collapse>;
};

const GraphContainer = ({ children }: { children: React.ReactNode }) => {
    const settings = useAtomValue(userSettingsAtom);
    return <Collapse in={settings.hourly.graph}>{children}</Collapse>;
};

const HourlyMain = () => {
    return (
        <Box>
            <Stack direction="row" mb={4} ml={2} justifyContent="space-between" alignItems="center">
                <Typography variant="h5">Hourly Forecast</Typography>
                <UserSettings />
            </Stack>
            <CardsContainer>
                <HourlyCardsContainer />
            </CardsContainer>
            <GraphContainer>
                <HourlyChart />
            </GraphContainer>
        </Box>
    );
};

export default HourlyMain;
