import { useEffect, useState } from "react";

import SinglePoint from "../SinglePoint";
import type { CityType } from "../../../types";
import { db } from "../../../utils/db";

const CitiesMain = () => {
    const [capitalCities, setCapitalCities] = useState<CityType[] | null>(null);

    useEffect(() => {
        (async () => {
            try {
                const cities = await db.cities
                    .filter((city) => city.capital === "primary" && +city.population > 100_000)
                    .toArray();
                if (cities) setCapitalCities(cities);
            } catch (error) {
                console.error(error);
            }
        })();
    }, []);

    if (!Array.isArray(capitalCities)) return null;

    return capitalCities.map((city: CityType) => (
        <SinglePoint key={city.id} lat={+city.lat} lon={+city.lng} />
    ));
};

export default CitiesMain;
