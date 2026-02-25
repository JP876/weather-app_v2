import { memo } from "react";
import { IconButton, Stack, Tooltip } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useAtomValue, useSetAtom } from "jotai";

import useCityItemActions from "../../WeatherForecast/AddCity/hooks/useCityItemActions";
import { citiesByCountry, selectedCityAtom } from "../../../atoms";

const SaveCityButton = () => {
    const selectedCity = useAtomValue(selectedCityAtom);
    const { isFavourite, saveFavouriteCity } = useCityItemActions(selectedCity);

    return (
        <Tooltip arrow disableInteractive title="Save to favourites">
            <IconButton size="small" onClick={saveFavouriteCity}>
                <FavoriteIcon
                    sx={(theme) => ({
                        transition: theme.transitions.create(["color"]),
                        color: isFavourite ? theme.palette.primary.main : "inherit",
                    })}
                />
            </IconButton>
        </Tooltip>
    );
};

const CloseDetailsButton = () => {
    const setSelectedCity = useSetAtom(selectedCityAtom);
    const setCitiesByCountry = useSetAtom(citiesByCountry);

    const closeDetails = () => {
        setSelectedCity(null);
        setCitiesByCountry(null);
    };

    return (
        <Tooltip arrow disableInteractive title="Close">
            <IconButton size="small" onClick={closeDetails}>
                <CloseIcon />
            </IconButton>
        </Tooltip>
    );
};

const SelectedCityActions = () => {
    return (
        <Stack direction="row" alignItems="center" gap={0.4}>
            <SaveCityButton />
            <CloseDetailsButton />
        </Stack>
    );
};

export default memo(SelectedCityActions);
