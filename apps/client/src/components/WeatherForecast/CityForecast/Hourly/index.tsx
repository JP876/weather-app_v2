import { memo, useCallback, useEffect, useRef, useState } from "react";
import { Box, Collapse, Skeleton, Stack, Typography } from "@mui/material";
import { AutoSizer, Grid, type GridCellProps } from "react-virtualized";
import { useAtomValue } from "jotai";

import HourlyCard, { HourlyCardContainer } from "./HourlyCard";
import HourlyChart from "./HourlyChart";
import UserSettings from "./UserSettings";
import { userSettingsAtom, weatherFetchInfoAtom } from "../../../../atoms";

const SkeletonCard = ({ isLoading, error }: { isLoading: boolean; error: boolean }) => {
    return (
        <HourlyCardContainer isLoading={isLoading} error={error}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Skeleton width={42} height={24} />
                <Skeleton width={42} height={24} />
            </Stack>

            <Stack direction="row" justifyContent="center" mb={2}>
                <Stack alignItems="center">
                    <Skeleton variant="circular" width={58} height={58} sx={{ mt: 2, mb: 1 }} />
                </Stack>
            </Stack>

            <Stack gap={1}>
                {Array.from({ length: 2 }).map((_, index) => (
                    <Stack key={index} sx={{ alignItems: "center" }}>
                        <Skeleton height={20} width={96} />
                        <Skeleton height={24} width={64} />
                    </Stack>
                ))}
            </Stack>
        </HourlyCardContainer>
    );
};

const style: React.CSSProperties = {
    overflowY: "hidden",
};

const HourlyCardsGrid = memo(() => {
    const cellRenderer = useCallback(({ columnIndex, key, style }: GridCellProps) => {
        return (
            <Box key={key} style={{ ...style }} sx={{ px: 1 }}>
                <HourlyCard index={columnIndex} />
            </Box>
        );
    }, []);

    return (
        <AutoSizer disableHeight>
            {({ width }) => (
                <Grid
                    rowCount={1}
                    columnCount={24}
                    columnWidth={164}
                    height={264}
                    rowHeight={264}
                    width={width}
                    cellRenderer={cellRenderer}
                    style={style}
                />
            )}
        </AutoSizer>
    );
});

const HourlyCardsContainer = () => {
    const justMounted = useRef(true);
    const [cardsContainer, setCardsContainer] = useState<HTMLDivElement | null>(null);

    const { isLoading, data: weatherData, error } = useAtomValue(weatherFetchInfoAtom);

    useEffect(() => {
        if (!justMounted.current && weatherData?.hourly && cardsContainer) {
            setTimeout(() => {
                cardsContainer.scrollTo({ top: 0, left: 0, behavior: "smooth" });
            }, 200);
        }

        if (Array.isArray(weatherData?.hourly) && cardsContainer) {
            justMounted.current = false;
        }
    }, [weatherData, cardsContainer]);

    return (
        <Stack
            ref={setCardsContainer}
            id="hourly-cards-container"
            direction="row"
            alignItems="center"
            sx={{ pb: 2.5 }}
        >
            {isLoading || !!error || weatherData === null ? (
                Array.from({ length: 24 }).map((_, index) => (
                    <SkeletonCard key={index} isLoading={isLoading} error={!!error} />
                ))
            ) : (
                <HourlyCardsGrid />
            )}
        </Stack>
    );
};

const CardsContainer = ({ children }: { children: React.ReactNode }) => {
    const settings = useAtomValue(userSettingsAtom);
    return <Collapse in={settings?.hourly?.cards}>{children}</Collapse>;
};

const GraphContainer = ({ children }: { children: React.ReactNode }) => {
    const settings = useAtomValue(userSettingsAtom);
    return <Collapse in={settings?.hourly?.graph}>{children}</Collapse>;
};

const HourlyMain = () => {
    return (
        <Box>
            <Stack direction="row" mb={4} justifyContent="space-between" gap={2}>
                <Typography variant="h5">Hourly Forecast</Typography>
                <UserSettings />
            </Stack>
            <CardsContainer>
                <HourlyCardsContainer />
            </CardsContainer>
            <GraphContainer>
                <HourlyChart />
            </GraphContainer>
        </Box>
    );
};

export default memo(HourlyMain);
