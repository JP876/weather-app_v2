import { useEffect, useMemo, useState } from "react";
import { Box, Button, Stack, styled, Tooltip, Typography, type StackProps } from "@mui/material";
import InfoOutlineIcon from "@mui/icons-material/InfoOutline";

import type { HourlyWeatherType, WeatherType } from "../../../types/weatherdata";

const DetailsContainer = styled(Box)(({ theme }) => ({
    width: "100%",
    display: "grid",
    gridTemplateColumns: "1fr 3.6rem",
    alignItems: "center",
    justifyContent: "space-between",
    gap: theme.spacing(2),

    "& p:nth-of-type(2)": {
        justifySelf: "start",
    },
}));

type HourlyCardContainerType = StackProps & {
    isLoading?: boolean;
};

export const HourlyCardContainer = styled(Stack, {
    shouldForwardProp: (prop) => prop !== "isLoading",
})<HourlyCardContainerType>(({ theme, isLoading }) => ({
    paddingInline: theme.spacing(2),
    paddingBlock: theme.spacing(1),
    borderRadius: theme.spacing(2),
    minWidth: "9.2rem",
    border: `1px solid ${isLoading ? theme.palette.action.disabled : theme.palette.primary.light}`,
    boxShadow: theme.shadows[1],
    transition: theme.transitions.create(["border-color"]),

    "&:hover": {
        borderColor: isLoading ? theme.palette.action.disabled : theme.palette.primary.dark,
    },
}));

type HourlyCardType = {
    data: Omit<HourlyWeatherType, "feels_like" | "temp" | "weather" | "rain" | "pop"> & {
        feels_like: string;
        temp: string;
        date: string;
        rain: string | null;
        pop: string;
        weather: (WeatherType & { iconSrc: string })[];
    };
};

const HourlyCard = ({ data }: HourlyCardType) => {
    const [detailsEl, setDetailsEl] = useState<HTMLDivElement | null>(null);
    const [open, setOpen] = useState(false);

    const tooltipTitleInfo = useMemo(() => {
        return [
            { label: "Feels Like", value: `${data.feels_like} \u00B0C` },
            { label: "Cloudiness", value: `${data.clouds} %` },
            { label: "Humidity", value: `${data.humidity} %` },
            { label: "UV index", value: `${data.uvi}` },
        ];
    }, [data.clouds, data.feels_like, data.humidity, data.uvi]);

    const handleClick = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    useEffect(() => {
        const controller = new AbortController();

        const handleCloseOnClickAway = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            const btnEl = document.getElementById(`details-button-${data.dt}`);

            if (!btnEl || !detailsEl) return;

            if (!detailsEl.contains(target) && !target.contains(btnEl)) {
                setOpen(false);
            }
        };

        if (detailsEl) {
            document.addEventListener("mousedown", handleCloseOnClickAway, {
                signal: controller.signal,
            });
        } else {
            controller.abort();
        }

        return () => {
            controller.abort();
        };
    }, [detailsEl, data.dt]);

    return (
        <HourlyCardContainer>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Typography variant="body1" fontWeight="bold" textAlign="center">
                    {data.date}
                </Typography>

                <Stack direction="row" alignItems="center" gap={1}>
                    <Typography>{`${data.temp} \u00B0C`}</Typography>
                </Stack>
            </Stack>

            <Stack direction="row" justifyContent="center" mb={2}>
                <Stack alignItems="center">
                    <Box
                        component="img"
                        width={96}
                        height={96}
                        src={data.weather[0].iconSrc}
                        alt={data.weather[0].description}
                    />
                </Stack>
            </Stack>

            <Tooltip
                arrow
                disableInteractive
                open={open}
                title={
                    <Stack ref={setDetailsEl} gap={0.4} sx={{ width: "100%" }}>
                        {tooltipTitleInfo.map((el) => (
                            <DetailsContainer key={el.label}>
                                <Typography>{el.label}</Typography>
                                <Typography>{el.value}</Typography>
                            </DetailsContainer>
                        ))}
                    </Stack>
                }
            >
                <Stack direction="row" justifyContent="center" alignItems="center">
                    <Button
                        id={`details-button-${data.dt}`}
                        size="small"
                        variant="outlined"
                        startIcon={<InfoOutlineIcon fontSize="small" />}
                        onClick={handleClick}
                    >
                        Details
                    </Button>
                </Stack>
            </Tooltip>
        </HourlyCardContainer>
    );
};

export default HourlyCard;
