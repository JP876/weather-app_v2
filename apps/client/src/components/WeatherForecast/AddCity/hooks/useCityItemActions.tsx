import { useAtom } from "jotai";
import { useLocation } from "wouter";

import type { CityType } from "../../../../types";
import { favouriteCitiesAtom } from "../../../../atoms";
import { db } from "../../../../utils/db";

const useCityItemActions = (cityInfo: CityType | null) => {
    const [favouriteCities, setFavouriteCities] = useAtom(favouriteCitiesAtom);
    const isFavourite = (favouriteCities || []).some(
        (city) => city.id.toString() === cityInfo?.id.toString(),
    );

    const [, navigate] = useLocation();

    const deleteDataFromDB = async (cityId: number) => {
        try {
            await db.weatherData.delete(cityId);
        } catch (err: unknown) {
            console.error(err);
        }
    };

    const navigateToFavouriteCity = () => {
        if (!cityInfo) {
            console.warn("City info not found");
            return;
        }

        if (!isFavourite) {
            setFavouriteCities((prevValue) => [...(prevValue || []), cityInfo]);
        }
        setTimeout(() => navigate(`/${cityInfo.id}`), 0);
    };

    const saveFavouriteCity = () => {
        if (!cityInfo) {
            console.warn("City info not found");
            return;
        }

        setFavouriteCities((prevValue) => {
            if (isFavourite) {
                deleteDataFromDB(+cityInfo.id);
                return (prevValue || []).filter(
                    (city) => city.id.toString() !== cityInfo.id.toString(),
                );
            }
            return [...(prevValue || []), cityInfo];
        });
    };

    return { favouriteCities, isFavourite, navigateToFavouriteCity, saveFavouriteCity };
};

export default useCityItemActions;
