import { useEffect } from "react";
import { Box, Skeleton, Stack, Typography } from "@mui/material";
import { useAtomValue } from "jotai";

import useMeasurementUnits from "../../../hooks/useMeasurementUnits";
import ClampedTextContainer from "../../ui/ClampedTextContainer";
import WeatherIcon from "../../ui/WeatherIcon";
import { selectedCityAtom } from "../../../atoms";
import CitiesByCountry from "./CitiesByCountry";
import getMinMax from "../../../utils/getMinMax";
import SelectedCityActions from "./SelectedCityActions";
import useFetchCurrentWeather from "./hooks/useFetchCurrentWeather";

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

type SelectedCityTitleProps = {
    iso2?: string;
    country?: string;
    city?: string;
};

const SelectedCityTitle = ({ iso2, country, city }: SelectedCityTitleProps) => {
    return (
        <Stack sx={{ maxWidth: "calc(100% - 5.4rem)" }}>
            <Stack direction="row" alignItems="center" gap={1} sx={{ width: "100%" }}>
                {iso2 ? (
                    <Box
                        component="img"
                        width={24}
                        height={16}
                        src={`https://flagcdn.com/w40/${iso2.toLowerCase()}.png`}
                        alt={`${country} flag`}
                    />
                ) : null}
                <ClampedTextContainer variant="h5">{city || ""}</ClampedTextContainer>
            </Stack>
            <ClampedTextContainer variant="body2">
                {`${country || ""}, ${iso2 || ""}`}
            </ClampedTextContainer>
        </Stack>
    );
};

const SelectedCityDetails = () => {
    const selectedCity = useAtomValue(selectedCityAtom);

    const { data, isLoading, handleFetch } = useFetchCurrentWeather();
    const units = useMeasurementUnits();

    useEffect(() => {
        if (selectedCity?.lat) {
            handleFetch({
                lat: selectedCity.lat.toString(),
                lng: selectedCity.lng.toString(),
            });
        }
    }, [handleFetch, selectedCity?.lat, selectedCity?.lng]);

    return (
        <Box
            sx={{
                height: "100%",
                display: "grid",
                gridTemplateRows: "repeat(10, 1fr)",
                gap: 2,
                p: 2,
            }}
        >
            <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ gridRowStart: 1, gridRowEnd: 2, alignSelf: "start" }}
            >
                <SelectedCityTitle
                    city={selectedCity?.city}
                    country={selectedCity?.country}
                    iso2={selectedCity?.iso2}
                />
                <SelectedCityActions />
            </Stack>

            <Stack
                direction="row"
                alignItems="center"
                justifyContent="center"
                gap={3.2}
                sx={{ gridRowStart: 2, gridRowEnd: 3, alignSelf: "start", mt: -1 }}
            >
                {isLoading ? (
                    <Skeleton height={60} width={getMinMax(144, 160)} />
                ) : (
                    <>
                        <Typography variant="h4">{`${data?.main.temp.toFixed(1)}${units.temp}`}</Typography>
                        {data?.weather[0].icon ? (
                            <WeatherIcon code={data?.weather[0].icon} size={60} />
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

                    display: "grid",
                    alignSelf: "center",
                    gridTemplateColumns: "1fr 1fr",
                })}
            >
                <CurrentWeatherDetailsContainer
                    label="Minimum"
                    value={`${data?.main.temp_min.toFixed(1)}${units.temp}`}
                    isLoading={isLoading === "INITIAL"}
                />
                <CurrentWeatherDetailsContainer
                    label="Maximum"
                    value={`${data?.main.temp_max.toFixed(1)}${units.temp}`}
                    isLoading={isLoading === "INITIAL"}
                />
                <CurrentWeatherDetailsContainer
                    label="Feels like"
                    value={`${data?.main?.feels_like.toFixed(1)}${units.temp}`}
                    isLoading={isLoading === "INITIAL"}
                />
                <CurrentWeatherDetailsContainer
                    label="Humidity"
                    value={`${data?.main?.humidity}%`}
                    isLoading={isLoading === "INITIAL"}
                />
            </Box>

            <Box id="cities-by-country-container" sx={{ gridRowStart: 4, gridRowEnd: -1 }}>
                <CitiesByCountry country={selectedCity?.country} />
            </Box>
        </Box>
    );
};

export default SelectedCityDetails;
