import { useMemo } from "react";
import { Box, Stack, styled, Tooltip, Typography } from "@mui/material";
import InfoOutlineIcon from "@mui/icons-material/InfoOutline";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import { useAtomValue } from "jotai";
import { format } from "date-fns";
import { weatherDataAtom } from "../../../atoms";
import getWeatherIconSrc from "../../../utils/getWeatherIconSrc";

const DailyItemContainer = styled(Box)(({ theme }) => ({
    width: "100%",
    display: "grid",
    gridTemplateColumns: "5.8rem .5fr .5fr .5fr .5fr 2rem",
    alignItems: "center",
    gap: theme.spacing(1),
    paddingInline: theme.spacing(2),
    transition: theme.transitions.create(["background"]),

    "&:not(:last-of-type)": {
        borderBottom: `1px solid ${theme.palette.grey[300]}`,
    },

    "&:hover": {
        background: theme.palette.grey[300],
    },
}));

const DailyMain = () => {
    const weatherData = useAtomValue(weatherDataAtom);

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

    return (
        <Box>
            <Stack direction="row" mb={4} ml={2} gap={2}>
                <Typography variant="h5">Daily Forecast</Typography>
            </Stack>

            <Stack>
                {dailyData.map((d) => (
                    <DailyItemContainer key={d.dt}>
                        <Typography>{d.day}</Typography>
                        <Box sx={{ justifySelf: "center" }}>
                            <Stack direction="row" alignItems="center" sx={{ width: "3.2rem" }}>
                                <WaterDropIcon fontSize="small" />
                                <Typography>{`${d.pop}%`}</Typography>
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
                        <Typography
                            sx={{ justifySelf: "center" }}
                        >{`${d.temp.max} \u00B0C`}</Typography>
                        <Typography
                            sx={{ justifySelf: "center" }}
                        >{`${d.temp.min} \u00B0C`}</Typography>
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
        </Box>
    );
};

export default DailyMain;
