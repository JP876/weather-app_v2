import { memo, useMemo } from "react";
import { Box, Skeleton, Stack, styled, Tooltip, Typography } from "@mui/material";
import InfoOutlineIcon from "@mui/icons-material/InfoOutline";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import { useAtomValue } from "jotai";
import { format } from "date-fns";

import getWeatherIconSrc from "../../../utils/getWeatherIconSrc";
import { weatherFetchInfoAtom } from "../../../atoms";
import getMinMax from "../../../utils/getMinMax";

const DailyItemContainer = styled(Box)(({ theme }) => ({
    width: "100%",
    display: "grid",
    gridTemplateColumns: "5.8rem .5fr .5fr .5fr .5fr 2rem",
    alignItems: "center",
    gap: theme.spacing(1),
    paddingInline: theme.spacing(2),
    transition: theme.transitions.create(["background"]),

    "&:not(:last-of-type)": {
        borderBottom: `1px solid ${theme.palette.divider}`,
    },

    "&:hover": {
        background: theme.alpha(theme.palette.divider, 0.08),
    },
}));

const LoadingDailyList = () => {
    return (
        <Stack>
            {Array.from({ length: 8 }).map((_, index) => (
                <DailyItemContainer key={index}>
                    <Skeleton height={32} />
                    <Box sx={{ justifySelf: "center" }}>
                        <Skeleton height={32} width={getMinMax(36, 56)} />
                    </Box>
                    <Box sx={{ justifySelf: "center", alignSelf: "center" }}>
                        <Stack
                            justifyContent="center"
                            alignItems="center"
                            sx={{ width: 44, height: 44 }}
                        >
                            <Skeleton width={30} height={30} variant="circular" />
                        </Stack>
                    </Box>
                    <Box sx={{ justifySelf: "center" }}>
                        <Skeleton width={48} height={32} />
                    </Box>
                    <Box sx={{ justifySelf: "center" }}>
                        <Skeleton width={48} height={32} />
                    </Box>
                    <Stack
                        justifyContent="center"
                        alignItems="center"
                        sx={{ justifySelf: "center", pl: 1.5 }}
                    >
                        <Skeleton width={28} height={28} variant="circular" />
                    </Stack>
                </DailyItemContainer>
            ))}
        </Stack>
    );
};

const DailyList = () => {
    const { isLoading, data: weatherData } = useAtomValue(weatherFetchInfoAtom);

    const dailyData = useMemo(() => {
        if (!Array.isArray(weatherData?.daily)) return [];

        return weatherData.daily.map((d) => ({
            ...d,
            day: format(new Date(d.dt * 1_000), "eee, dd/MM"),
            temp: {
                ...d.temp,
                max: d.temp.max.toFixed(1),
                min: d.temp.min.toFixed(1),
                day: d.temp.day.toFixed(1),
                morn: d.temp.morn.toFixed(1),
            },
            pop: `${(d.pop * 100).toFixed(0)}`,
            weather: d.weather.map((el) => ({
                ...el,
                iconSrc: getWeatherIconSrc(el.icon),
            })),
        }));
    }, [weatherData]);

    if (isLoading) {
        return <LoadingDailyList />;
    }

    return (
        <Stack px={2}>
            {dailyData.map((d) => (
                <DailyItemContainer key={d.dt}>
                    <Typography>{d.day}</Typography>
                    <Box sx={{ justifySelf: "center" }}>
                        <Stack direction="row" alignItems="center" sx={{ width: "3.2rem" }}>
                            <WaterDropIcon fontSize="small" />
                            <Typography ml={0.5}>{`${d.pop}%`}</Typography>
                        </Stack>
                    </Box>
                    <Box sx={{ justifySelf: "center", alignSelf: "center" }}>
                        <Box
                            component="img"
                            src={d.weather[0].iconSrc}
                            alt={d.weather[0].description}
                            width={44}
                            height={44}
                        />
                    </Box>
                    <Box sx={{ justifySelf: "center" }}>
                        <Typography>{`${d.temp.max} \u00B0C`}</Typography>
                    </Box>
                    <Box sx={{ justifySelf: "center" }}>
                        <Typography>{`${d.temp.min} \u00B0C`}</Typography>
                    </Box>
                    <Tooltip
                        arrow
                        placement="right"
                        disableInteractive
                        title={<Typography>{d.summary}</Typography>}
                    >
                        <InfoOutlineIcon fontSize="small" sx={{ justifySelf: "end" }} />
                    </Tooltip>
                </DailyItemContainer>
            ))}
        </Stack>
    );
};

export default memo(DailyList);
