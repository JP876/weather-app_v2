import { memo } from "react";
import { Box, Skeleton, Stack, styled, Typography, type StackProps } from "@mui/material";
import { useAtomValue } from "jotai";

import useCityInfo from "../hooks/useCityInfo";
import { currentWeatherDataAtom, weatherFetchInfoAtom } from "../../../../atoms";
import WeatherIcon from "../../../ui/WeatherIcon";
import ClampedTextContainer from "../../../ui/ClampedTextContainer";
import StatusFeedback from "./StatusFeedback";

type CurrentTemperatureProps = {
    temp?: string;
    icon?: string;
};

const CurrentTemperatureContainer = styled(Stack)<StackProps>(({ theme }) => ({
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: `1px solid ${theme.palette.divider}`,
    height: "6.4rem",
}));

const LocationInfo = () => {
    const cityInfo = useCityInfo();

    return (
        <Stack mr={4}>
            <Stack direction="row" alignItems="center" gap={2}>
                <ClampedTextContainer variant="h4">{cityInfo?.city}</ClampedTextContainer>
            </Stack>
            <ClampedTextContainer variant="body2">
                {`${cityInfo?.country}, ${cityInfo?.iso2}`}
            </ClampedTextContainer>
        </Stack>
    );
};

const LastTimeUpdated = () => {
    return (
        <Box sx={{ display: "grid", gap: 0.4, gridTemplateColumns: "1fr 2.8rem" }}>
            <Typography variant="caption">Last update: </Typography>
            <Box sx={{ justifySelf: "center", alignItems: "center", height: 20 }}>
                <StatusFeedback />
            </Box>
        </Box>
    );
};

const CurrentWeatherDetailsContainer = ({
    label,
    value,
}: {
    label: string;
    value?: string | number;
}) => {
    return (
        <Stack>
            <Typography variant="subtitle1">{label}</Typography>
            <Typography variant="h6">{value}</Typography>
        </Stack>
    );
};

const CurrentTemperature = ({ temp, icon }: CurrentTemperatureProps) => {
    return (
        <Stack direction="row" alignItems="center" gap={3.2}>
            <Stack alignItems="end">
                <Typography variant="h4">{temp}</Typography>
                <LastTimeUpdated />
            </Stack>
            {icon ? (
                <Box my={2.5}>
                    <WeatherIcon code={icon} size={60} />
                </Box>
            ) : null}
        </Stack>
    );
};

const currentInfo = ["Feels like", "Humidity", "Current UV index", "Cloudiness"];

const LoadingDataContainer = ({
    hasData,
    children,
}: {
    hasData: boolean;
    children: React.ReactNode;
}) => {
    const { isLoading, error } = useAtomValue(weatherFetchInfoAtom);

    const errorType = error ? error.type : null;
    const isError = errorType === "API_ERROR" || errorType === "NETWORK_ERROR";

    if (!hasData || isLoading === "INITIAL" || isError) {
        return (
            <>
                <CurrentTemperatureContainer>
                    <LocationInfo />
                    <Skeleton height={100} width={170} />
                </CurrentTemperatureContainer>
                <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1 }}>
                    {currentInfo.map((value, index) => (
                        <Stack key={index}>
                            <Typography variant="subtitle1">{value}</Typography>
                            <Skeleton height={32} width={100} />
                        </Stack>
                    ))}
                </Box>
            </>
        );
    }

    return <Box component="section">{children}</Box>;
};

const CurrentMain = () => {
    const currentWeather = useAtomValue(currentWeatherDataAtom);

    return (
        <LoadingDataContainer hasData={!!currentWeather}>
            <CurrentTemperatureContainer>
                <LocationInfo />
                <CurrentTemperature
                    temp={currentWeather?.temp}
                    icon={currentWeather?.weather[0].icon}
                />
            </CurrentTemperatureContainer>

            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, mt: 2 }}>
                <CurrentWeatherDetailsContainer
                    label="Feels like"
                    value={currentWeather?.feels_like}
                />
                <CurrentWeatherDetailsContainer label="Humidity" value={currentWeather?.humidity} />
                <CurrentWeatherDetailsContainer
                    label="Current UV index"
                    value={currentWeather?.uvi}
                />
                <CurrentWeatherDetailsContainer label="Cloudiness" value={currentWeather?.clouds} />
            </Box>
        </LoadingDataContainer>
    );
};

export default memo(CurrentMain);
