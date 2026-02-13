import { useCallback } from "react";

import { db } from "../../../utils/db";

const useCoordinates = () => {
    return useCallback(async () => {
        const { timeZone } = Intl.DateTimeFormat().resolvedOptions();

        try {
            let city = await db.cities
                .filter(
                    (city) =>
                        city.timezone === timeZone &&
                        (city.capital === "primary" || city.capital === "admin"),
                )
                .first();

            if (!city) {
                const firstCity = await db.cities
                    .filter((city) => city.timezone === timeZone)
                    .first();
                if (!firstCity) {
                    throw new Error("City info not found");
                }
                city = firstCity;
            }
            return city;
        } catch (err) {
            console.error(err);
        }
    }, []);
};

export default useCoordinates;
