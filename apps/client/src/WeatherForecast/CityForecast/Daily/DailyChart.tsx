import { memo, useMemo } from "react";
import { useAtomValue } from "jotai";
import { BarChart } from "@mui/x-charts";
import { format } from "date-fns";

import { isLoadingWeatherDataAtom, weatherDataAtom } from "../../../atoms";
import { Skeleton } from "@mui/material";

const DailyChart = () => {
    const weatherData = useAtomValue(weatherDataAtom);
    const isLoading = useAtomValue(isLoadingWeatherDataAtom);

    const dataset = useMemo(() => {
        if (!weatherData) return [];
        return weatherData.daily.map((el) => {
            const date = format(new Date(el.dt * 1_000), "dd/MM");
            return { date, tempMin: el.temp.min, tempMax: el.temp.max };
        });
    }, [weatherData]);

    if (isLoading) {
        return <Skeleton height={310} />;
    }

    if (!weatherData) return null;

    return (
        <BarChart
            height={280}
            dataset={dataset}
            xAxis={[{ dataKey: "date", scaleType: "band" }]}
            yAxis={[{ label: `Temperature \u00B0C`, width: 42 }]}
            grid={{ horizontal: true }}
            series={[
                { dataKey: "tempMin", label: `Min` },
                { dataKey: "tempMax", label: `Max` },
            ]}
        />
    );
};

export default memo(DailyChart);
