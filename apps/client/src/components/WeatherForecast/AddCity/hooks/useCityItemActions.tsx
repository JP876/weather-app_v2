import { useAtom } from "jotai";
import { useLocation } from "wouter";

import type { CityType } from "../../../../types";
import { favouriteCitiesAtom } from "../../../../atoms";
import { db } from "../../../../utils/db";
import { FAV_CITY_LIMIT } from "../../../../consts";
import useSnackbar from "../../../../hooks/useSnackbar";

const useCityItemActions = (cityInfo: CityType | null) => {
    const [favouriteCities, setFavouriteCities] = useAtom(favouriteCitiesAtom);
    const isFavourite = (favouriteCities || []).some(
        (city) => city.id.toString() === cityInfo?.id.toString(),
    );

    const [, navigate] = useLocation();
    const { openSnackbar } = useSnackbar();

    const deleteDataFromDB = async (cityId: number) => {
        try {
            await db.weatherData.delete(cityId);
        } catch (err: unknown) {
            console.error(err);
        }
    };

    const checkLimit = () => {
        if (Array.isArray(favouriteCities) && favouriteCities.length + 1 > FAV_CITY_LIMIT) {
            openSnackbar({
                severity: "warning",
                message: "You've hit the limit — remove one to add another.",
            });
            return false;
        }
        return true;
    };

    const navigateToFavouriteCity = () => {
        if (!cityInfo) {
            console.warn("City info not found");
            return;
        }

        if (!isFavourite) {
            if (!checkLimit()) return;
            setFavouriteCities((prevValue) => [...(prevValue || []), cityInfo]);
        }
        setTimeout(() => navigate(`/${cityInfo.id}`, { transition: true }), 0);
    };

    const saveFavouriteCity = () => {
        if (!cityInfo) {
            console.warn("City info not found");
            return;
        }

        if (!isFavourite) {
            if (!checkLimit()) return;
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
