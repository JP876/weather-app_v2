import { useCallback, useMemo } from "react";
import { useAtomValue } from "jotai";
import { Box, useTheme } from "@mui/material";
import { AutoSizer, List, type ListRowProps } from "react-virtualized";

import useCityListHeight from "../hooks/useCityListHeight";
import CityListSkeleton from "../CityListSkeleton";
import { citiesFetchInfoAtom, filteredCitiesAtom } from "../../../../atoms";
import CityListItem from "./CityListItem";

const CityList = () => {
    const { isLoading, error } = useAtomValue(citiesFetchInfoAtom);
    const filteredCities = useAtomValue(filteredCitiesAtom);

    const { height } = useCityListHeight();

    const theme = useTheme();

    const listStyle = useMemo<React.CSSProperties>(() => {
        return {
            padding: "1rem",
            overflow: "auto",
            scrollbarColor: `${theme.palette.primary.light} transparent`,
            scrollbarWidth: "thin",
            scrollBehavior: "smooth",
            scrollMargin: 0,
        };
    }, [theme.palette.primary.light]);

    const rowRenderer = useCallback(({ index, key, style }: ListRowProps) => {
        return (
            <Box key={key} style={style}>
                <CityListItem index={index} />
            </Box>
        );
    }, []);

    if (isLoading || !!error || filteredCities === null) {
        return <CityListSkeleton />;
    }

    return (
        <AutoSizer disableHeight>
            {({ width }) => (
                <List
                    width={width}
                    height={height || 960}
                    rowCount={filteredCities.length}
                    rowHeight={58}
                    rowRenderer={rowRenderer}
                    style={listStyle}
                />
            )}
        </AutoSizer>
    );
};

export default CityList;
