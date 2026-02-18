import { useMemo } from "react";
import { useAtomValue } from "jotai";

import { userSettingsAtom } from "../atoms";

const useMeasurementUnits = () => {
    const userSettings = useAtomValue(userSettingsAtom);

    return useMemo(() => {
        const temp = userSettings.units === "imperial" ? "\u00B0F" : "\u00B0C";
        const windSpeed = userSettings.units === "imperial" ? "miles/hour" : "meter/sec";

        return { temp, windSpeed };
    }, [userSettings.units]);
};

export default useMeasurementUnits;
