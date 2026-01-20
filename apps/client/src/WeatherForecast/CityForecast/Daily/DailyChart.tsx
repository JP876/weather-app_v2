import { useMemo } from "react";
import { useAtomValue } from "jotai";
import { BarChart } from "@mui/x-charts";
import { format } from "date-fns";

import { weatherDataAtom } from "../../../atoms";

const DailyChart = () => {
    const weatherData = useAtomValue(weatherDataAtom);

    const dataset = useMemo(() => {
        if (!weatherData) return [];
        return weatherData.daily.map((el) => {
            const date = format(new Date(el.dt * 1_000), "dd/MM/yy HH:mm");
            return { date, tempMin: el.temp.min, tempMax: el.temp.max };
        });
    }, [weatherData]);

    if (!weatherData) return null;

    return (
        <BarChart
            height={280}
            dataset={dataset}
            xAxis={[{ dataKey: "date", scaleType: "band" }]}
            yAxis={[{ label: `Temperature \u00B0C`, width: 50 }]}
            grid={{ horizontal: true }}
            series={[
                { dataKey: "tempMin", label: `Min` },
                { dataKey: "tempMax", label: `Max` },
            ]}
        />
    );
};

export default DailyChart;
