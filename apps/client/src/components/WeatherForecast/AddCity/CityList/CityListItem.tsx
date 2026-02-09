import React from "react";
import { useAtom, useAtomValue } from "jotai";
import { useLocation } from "wouter";

import { favouriteCitiesAtom, filteredCitiesAtom } from "../../../../atoms";
import { CityListItemContainer } from "../styledComps";
import { db } from "../../../../utils/db";
import CityInfo from "./CityInfo";

type CityListItemType = {
    index: number;
};

const CityListItem = ({ index }: CityListItemType) => {
    const [favouriteCities, setFavouriteCities] = useAtom(favouriteCitiesAtom);
    const filteredCities = useAtomValue(filteredCitiesAtom);

    const [, navigate] = useLocation();

    const cityInfo = filteredCities?.[index] || null;

    const isFavourite = (favouriteCities || []).some(
        (city) => city.id.toString() === cityInfo?.id.toString(),
    );

    const deleteDataFromDB = async (cityId: number) => {
        try {
            await db.weatherData.delete(cityId);
        } catch (err: unknown) {
            console.error(err);
        }
    };

    const navigateToFavouriteCity = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (event.button !== 1 || !cityInfo) return;

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

    if (!cityInfo) return null;

    return (
        <CityListItemContainer
            id={`city_container-${index}`}
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            isFavourite={isFavourite}
            onClick={saveFavouriteCity}
            onAuxClick={navigateToFavouriteCity}
        >
            <CityInfo
                isFavourite={isFavourite}
                iso2={cityInfo.iso2}
                city={cityInfo.city}
                country={cityInfo.country}
                lat={cityInfo.lat}
                lng={cityInfo.lng}
            />
        </CityListItemContainer>
    );
};

export default CityListItem;
