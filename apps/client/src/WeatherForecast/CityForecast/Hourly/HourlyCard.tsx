import { useMemo } from "react";
import { Stack, styled, Typography, type StackProps } from "@mui/material";

import type { HourlyWeatherType, WeatherType } from "../../../types/weatherdata";
import WeatherIcon from "../../../components/WeatherIcon";

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
        paddingInline: theme.spacing(2),
        paddingBlock: theme.spacing(1),
        borderRadius: theme.spacing(2),
        minWidth: "9.4rem",
        border: `1px solid ${borderColor}`,
        boxShadow: theme.shadows[1],
    };
});

type HourlyCardType = {
    data: Omit<HourlyWeatherType, "feels_like" | "temp" | "weather" | "rain" | "pop"> & {
        feels_like: string;
        temp: string;
        date: string;
        rain: string | null;
        pop: string;
        weather: WeatherType[];
    };
};

const HourlyCard = ({ data }: HourlyCardType) => {
    const tooltipTitleInfo = useMemo(() => {
        return [
            { label: "Feels Like", value: `${data.feels_like}\u00B0C` },
            { label: "Humidity", value: `${data.humidity}%` },
        ];
    }, [data.feels_like, data.humidity]);

    return (
        <HourlyCardContainer>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Typography variant="body1" fontWeight="bold" textAlign="center">
                    {data.date}
                </Typography>

                <Stack direction="row" alignItems="center">
                    <Typography>{`${data.temp}\u00B0C`}</Typography>
                </Stack>
            </Stack>

            <Stack direction="row" justifyContent="center">
                <Stack alignItems="center" my={2.5}>
                    {data.weather[0]?.icon ? <WeatherIcon code={data.weather[0].icon} /> : null}
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
