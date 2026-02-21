import { useEffect, useState } from "react";
import { useSetAtom } from "jotai";

import SinglePoint from "../SinglePoint";
import type { CityType } from "../../../types";
import { db } from "../../../utils/db";
import { selectedCityAtom } from "../../../atoms";
import calcCoordToPos from "../../../utils/calcCoordToPos";

const CitiesMain = () => {
    const [capitalCities, setCapitalCities] = useState<CityType[] | null>(null);
    const setSelectedCity = useSetAtom(selectedCityAtom);

    const handleOnClick = (city: CityType) => {
        const position = calcCoordToPos({ lat: +city.lat, lng: +city.lng });
        setSelectedCity({ ...city, position });
    };

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
        <SinglePoint
            key={city.id}
            lat={+city.lat}
            lon={+city.lng}
            onClick={() => handleOnClick(city)}
        />
    ));
};

export default CitiesMain;
