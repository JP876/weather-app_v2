import { memo, useEffect, useState } from "react";
import { Box, IconButton, Skeleton, Stack, Tooltip, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useAtomValue, useSetAtom } from "jotai";

import type { CurrentWeatherDataType } from "../../../types/weatherdata";
import useMeasurementUnits from "../../../hooks/useMeasurementUnits";
import ClampedTextContainer from "../../ui/ClampedTextContainer";
import WeatherIcon from "../../ui/WeatherIcon";
import useCityItemActions from "../../WeatherForecast/AddCity/hooks/useCityItemActions";
import { citiesByCountry, selectedCityAtom } from "../../../atoms";
import CitiesByCountry from "./CitiesByCountry";
import type { FetchInfoType } from "../../../atoms/types";
import getMinMax from "../../../utils/getMinMax";
import withFetch from "../../../utils/withFetch";

type CurrentWeatherDetailsContainerProps = {
    label: string;
    value?: string;
    isLoading?: boolean;
};

const CurrentWeatherDetailsContainer = ({
    label,
    value,
    isLoading,
}: CurrentWeatherDetailsContainerProps) => {
    return (
        <Stack alignItems="center" justifyContent="center">
            <Typography variant="subtitle1">{label}</Typography>
            {isLoading ? (
                <Skeleton height={32} width={getMinMax(64, 72)} />
            ) : (
                <Typography variant="h6">{value}</Typography>
            )}
        </Stack>
    );
};

const SaveCityButton = memo(() => {
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
});

const CloseDetailsButton = memo(() => {
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
});

const SelectedCityDetails = () => {
    const selectedCity = useAtomValue(selectedCityAtom);
    const [fetchWeatherInfo, setFetchWeatherInfo] = useState<FetchInfoType<CurrentWeatherDataType>>(
        { data: null, isLoading: false, error: false },
    );

    const units = useMeasurementUnits();

    useEffect(() => {
        if (selectedCity?.lat) {
            (async () => {
                setFetchWeatherInfo((prevValue) => ({
                    ...prevValue,
                    error: false,
                    isLoading: true,
                }));

                const lat = selectedCity.lat;
                const lng = selectedCity.lng;

                const [err, res] = await withFetch(
                    `/api/v1/current-weather?lat=${lat}&lng=${lng}&units=${units.units}`,
                    {},
                    { delay: 500 },
                );

                if (err) {
                    const { error, type } = err;
                    setFetchWeatherInfo({
                        data: null,
                        isLoading: false,
                        error: { type, msg: error.message, cause: error.cause },
                    });
                    return null;
                }

                const data = (await res.json()) as { results: CurrentWeatherDataType };
                setFetchWeatherInfo({ data: data.results, isLoading: false, error: false });
            })();
        }
    }, [selectedCity?.lat, selectedCity?.lng, units.units]);

    if (!selectedCity) return null;

    return (
        <Box
            p={2}
            sx={{
                height: "100%",
                display: "grid",
                gridTemplateRows: "repeat(10, 1fr)",
                gap: 2,
            }}
        >
            <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ gridRowStart: 1, gridRowEnd: 2, alignSelf: "start" }}
            >
                <Stack sx={{ maxWidth: "calc(100% - 5.4rem)" }}>
                    <Stack direction="row" alignItems="center" gap={1} sx={{ width: "100%" }}>
                        <Box
                            component="img"
                            width={24}
                            height={16}
                            src={`https://flagcdn.com/w40/${selectedCity.iso2.toLowerCase()}.png`}
                            alt={`${selectedCity.country} flag`}
                        />
                        <ClampedTextContainer variant="h5">
                            {selectedCity.city}
                        </ClampedTextContainer>
                    </Stack>
                    <ClampedTextContainer variant="body2">
                        {`${selectedCity.country}, ${selectedCity.iso2}`}
                    </ClampedTextContainer>
                </Stack>
                <Stack direction="row" alignItems="center" gap={0.4}>
                    <SaveCityButton />
                    <CloseDetailsButton />
                </Stack>
            </Stack>

            <Stack
                direction="row"
                alignItems="center"
                justifyContent="center"
                gap={3.2}
                sx={{ gridRowStart: 2, gridRowEnd: 3 }}
            >
                {fetchWeatherInfo.isLoading ? (
                    <Skeleton height={60} width={getMinMax(144, 160)} />
                ) : (
                    <>
                        <Typography variant="h4">{`${fetchWeatherInfo.data?.main.temp.toFixed(1)}${units.temp}`}</Typography>
                        {fetchWeatherInfo.data?.weather[0].icon ? (
                            <WeatherIcon code={fetchWeatherInfo.data?.weather[0].icon} size={60} />
                        ) : null}
                    </>
                )}
            </Stack>

            <Box
                sx={() => ({
                    gap: 1,
                    paddingBottom: 2,
                    gridRowStart: 3,
                    gridRowEnd: 4,
                    marginBottom: 2,
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                })}
            >
                <CurrentWeatherDetailsContainer
                    label="Minimum"
                    value={`${fetchWeatherInfo.data?.main.temp_min.toFixed(1)}${units.temp}`}
                    isLoading={fetchWeatherInfo.isLoading}
                />
                <CurrentWeatherDetailsContainer
                    label="Maximum"
                    value={`${fetchWeatherInfo.data?.main.temp_max.toFixed(1)}${units.temp}`}
                    isLoading={fetchWeatherInfo.isLoading}
                />
                <CurrentWeatherDetailsContainer
                    label="Feels like"
                    value={`${fetchWeatherInfo.data?.main?.feels_like.toFixed(1)}${units.temp}`}
                    isLoading={fetchWeatherInfo.isLoading}
                />
                <CurrentWeatherDetailsContainer
                    label="Humidity"
                    value={`${fetchWeatherInfo.data?.main?.humidity}%`}
                    isLoading={fetchWeatherInfo.isLoading}
                />
            </Box>

            <Box id="cities-by-country-container" sx={{ gridRowStart: 4, gridRowEnd: -1 }}>
                <CitiesByCountry country={selectedCity.country} />
            </Box>
        </Box>
    );
};

export default SelectedCityDetails;
