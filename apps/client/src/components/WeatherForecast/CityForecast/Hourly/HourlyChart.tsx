import { useMemo } from "react";
import { useAtomValue } from "jotai";
import { format } from "date-fns";
import { BarChart } from "@mui/x-charts";

import { Box, Skeleton } from "@mui/material";
import { weatherFetchInfoAtom } from "../../../../atoms";
import useMeasurementUnits from "../../../../hooks/useMeasurementUnits";

const HourlyChart = () => {
    const { isLoading, data: weatherData, error } = useAtomValue(weatherFetchInfoAtom);
    const { temp } = useMeasurementUnits();

    const errorType = error ? error.type : null;
    const isError = errorType === "API_ERROR" || errorType === "NETWORK_ERROR";

    const dataset = useMemo(() => {
        if (!weatherData) return null;
        return weatherData.hourly
            .filter((_, i) => i % 2 === 0)
            .map((el) => {
                return { date: el.dt * 1_000, temp: el.temp };
            });
    }, [weatherData]);

    if (isLoading || isError || dataset === null) {
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
                    height: 28,
                },
            ]}
            yAxis={[{ label: `Temperature${temp}`, width: 48 }]}
            grid={{ horizontal: true }}
            series={[{ dataKey: "temp" }]}
        />
    );
};

export default HourlyChart;
