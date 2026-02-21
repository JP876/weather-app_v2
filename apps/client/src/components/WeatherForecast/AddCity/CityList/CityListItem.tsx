import React from "react";
import { useAtomValue } from "jotai";

import { filteredCitiesAtom, userSettingsAtom } from "../../../../atoms";
import { CityListItemContainer } from "../styledComps";
import CityInfo from "./CityInfo";
import useCityItemActions from "../hooks/useCityItemActions";

type CityListItemType = {
    index: number;
};

const CityListItem = ({ index }: CityListItemType) => {
    const filteredCities = useAtomValue(filteredCitiesAtom);
    const { leftClick, middleClick } = useAtomValue(userSettingsAtom);

    const cityInfo = filteredCities?.[index] || null;
    const { isFavourite, navigateToFavouriteCity, saveFavouriteCity } =
        useCityItemActions(cityInfo);

    const onClick = () => {
        switch (leftClick) {
            case "add":
                saveFavouriteCity();
                break;
            case "navigate":
                navigateToFavouriteCity();
        }
    };

    const onAuxClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (event.button !== 1) return;

        switch (middleClick) {
            case "add":
                saveFavouriteCity();
                break;
            case "navigate":
                navigateToFavouriteCity();
        }
    };

    if (!cityInfo) return null;

    return (
        <CityListItemContainer
            id={`city_container-${index}`}
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            isFavourite={isFavourite}
            onClick={onClick}
            onAuxClick={onAuxClick}
        >
            <CityInfo
                isFavourite={isFavourite}
                iso2={cityInfo.iso2}
                city={cityInfo.city}
                country={cityInfo.country}
                lat={cityInfo.lat}
                lng={cityInfo.lng}
                timezone={cityInfo.timezone}
                capital={cityInfo.capital}
            />
        </CityListItemContainer>
    );
};

export default CityListItem;
