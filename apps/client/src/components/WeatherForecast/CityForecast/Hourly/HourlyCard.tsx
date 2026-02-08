import { useMemo } from "react";
import { Stack, styled, Typography, type StackProps } from "@mui/material";
import { format } from "date-fns";
import { useAtomValue } from "jotai";

import WeatherIcon from "../../../WeatherIcon";
import { weatherFetchInfoAtom } from "../../../../atoms";

type HourlyCardContainerType = StackProps & {
    isLoading?: boolean;
    error?: boolean;
};

export const HourlyCardContainer = styled(Stack, {
    shouldForwardProp: (prop) => prop !== "isLoading" && prop !== "error",
})<HourlyCardContainerType>(({ theme, isLoading, error }) => {
    const borderColor = (() => {
        if (isLoading || error) return theme.palette.action.disabled;
        return theme.palette.primary.main;
    })();

    return {
        width: "100%",
        paddingInline: theme.spacing(2),
        paddingBlock: theme.spacing(1),
        borderRadius: theme.spacing(2),
        border: `1px solid ${borderColor}`,
        boxShadow: theme.shadows[1],
    };
});

const HourlyCard = ({ index }: { index: number }) => {
    const { data: weatherData, isLoading } = useAtomValue(weatherFetchInfoAtom);

    const hourlyData = useMemo(() => {
        if (!Array.isArray(weatherData?.hourly)) return null;
        const d = weatherData.hourly.filter((_, i) => i % 2 === 0)[index];
        return {
            ...d,
            date: format(new Date(d.dt * 1_000), "HH:mm"),
            temp: d.temp.toFixed(1),
            feels_like: d.feels_like.toFixed(1),
            rain: d?.rain ? `${(d.rain["1h"] * 100).toFixed(0)}mm/h` : null,
            pop: `${(d.pop * 100).toFixed(0)}%`,
        };
    }, [index, weatherData]);

    const tooltipTitleInfo = useMemo(() => {
        return [
            { label: "Feels Like", value: `${hourlyData?.feels_like}\u00B0C` },
            { label: "Humidity", value: `${hourlyData?.humidity}%` },
        ];
    }, [hourlyData]);

    return (
        <HourlyCardContainer isLoading={isLoading}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Typography variant="body1" fontWeight="bold" textAlign="center">
                    {hourlyData?.date}
                </Typography>

                <Stack direction="row" alignItems="center">
                    <Typography>{`${hourlyData?.temp}\u00B0C`}</Typography>
                </Stack>
            </Stack>

            <Stack direction="row" justifyContent="center">
                <Stack alignItems="center" my={2.5}>
                    {hourlyData?.weather[0]?.icon ? (
                        <WeatherIcon code={hourlyData?.weather[0].icon} />
                    ) : null}
                </Stack>
            </Stack>

            <Stack gap={1}>
                {tooltipTitleInfo.map((el) => (
                    <Stack key={el.label} sx={{ textAlign: "center" }}>
                        <Typography
                            sx={(theme) => ({
                                fontWeight: theme.typography.fontWeightLight,
                                fontSize: theme.typography.fontSize,
                            })}
                        >{`${el.label}:`}</Typography>
                        <Typography
                            sx={(theme) => ({
                                fontWeight: theme.typography.fontWeightMedium,
                            })}
                        >
                            {el.value}
                        </Typography>
                    </Stack>
                ))}
            </Stack>
        </HourlyCardContainer>
    );
};

export default HourlyCard;
