import { useMemo } from "react";
import { useAtomValue } from "jotai";
import { format } from "date-fns";
import { BarChart } from "@mui/x-charts";

import { weatherFetchInfoAtom } from "../../../atoms";
import { Box, Skeleton } from "@mui/material";

const HourlyChart = () => {
    const { isLoading, data: weatherData, error } = useAtomValue(weatherFetchInfoAtom);

    const dataset = useMemo(() => {
        if (!weatherData) return [];
        return weatherData.hourly
            .filter((_, i) => i % 2 === 0)
            .map((el) => {
                return { date: el.dt * 1_000, temp: el.temp };
            });
    }, [weatherData]);

    if (isLoading || !!error) {
        return (
            <Box px={2}>
                <Skeleton height={280} />
            </Box>
        );
    }

    if (!weatherData) return null;

    return (
        <BarChart
            height={280}
            dataset={dataset}
            xAxis={[
                {
                    dataKey: "date",
                    scaleType: "band",
                    valueFormatter: (value: number) => format(new Date(value), "HH:mm"),
                },
            ]}
            yAxis={[{ label: `Temperature\u00B0C`, width: 42 }]}
            grid={{ horizontal: true }}
            series={[{ dataKey: "temp" }]}
        />
    );
};

export default HourlyChart;
