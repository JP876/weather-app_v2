import { useEffect, useState } from "react";
import { atom, useAtomValue, useSetAtom } from "jotai";

import SinglePoint from "../SinglePoint";
import type { CityType } from "../../../types";
import { db } from "../../../utils/db";
import { citiesFetchInfoAtom, selectedCityAtom } from "../../../atoms";
import calcCoordToPos from "../../../utils/calcCoordToPos";
import withCatch from "../../../utils/withCatch";

const isLoadingCitiesAtom = atom((get) => get(citiesFetchInfoAtom).isLoading);

const CitiesMain = () => {
    const [capitalCities, setCapitalCities] = useState<CityType[] | null>(null);

    const isLoadingCities = useAtomValue(isLoadingCitiesAtom);
    const setSelectedCity = useSetAtom(selectedCityAtom);

    const handleOnClick = (city: CityType) => {
        const position = calcCoordToPos({ lat: +city.lat, lng: +city.lng });
        setSelectedCity({ ...city, position });
    };

    useEffect(() => {
        if (!isLoadingCities) {
            (async () => {
                const [, cities] = await withCatch(
                    db.cities
                        .filter((city) => city.capital === "primary" && +city.population > 100_000)
                        .toArray(),
                );
                if (cities) setCapitalCities(cities);
            })();
        }
    }, [isLoadingCities]);

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
