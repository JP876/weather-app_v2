import { useCallback, useMemo } from "react";
import { useAtomValue } from "jotai";
import { Box } from "@mui/material";
import { AutoSizer, List, type ListRowProps } from "react-virtualized";

import useCityListHeight from "../hooks/useCityListHeight";
import CityListSkeleton from "../CityListSkeleton";
import { citiesFetchInfoAtom, filteredCitiesAtom } from "../../../../atoms";
import CityListItem from "./CityListItem";

export const LIST_ID = "cities_list_all";

const CityList = () => {
    const { isLoading, error } = useAtomValue(citiesFetchInfoAtom);
    const filteredCities = useAtomValue(filteredCitiesAtom);

    const { height } = useCityListHeight();

    const listStyle = useMemo<React.CSSProperties>(() => {
        return {
            padding: "1rem",
            overflow: "auto",
            scrollbarWidth: "thin",
            scrollBehavior: "smooth",
            scrollMargin: 0,
        };
    }, []);

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
                    id={LIST_ID}
                    width={width}
                    height={height || 720}
                    rowCount={filteredCities.length}
                    rowHeight={64}
                    rowRenderer={rowRenderer}
                    style={listStyle}
                />
            )}
        </AutoSizer>
    );
};

export default CityList;
