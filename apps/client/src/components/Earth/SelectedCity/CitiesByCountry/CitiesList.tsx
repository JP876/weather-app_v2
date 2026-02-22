import { memo, useCallback, useMemo } from "react";
import { useAtomValue } from "jotai";
import { AutoSizer, List, type ListRowProps } from "react-virtualized";
import { Box, Typography } from "@mui/material";

import CityListItem from "./CityListItem";
import { citiesByCountry } from "../../../../atoms";

export const LIST_ID = "cities_list_by_country";

const CitiesList = memo(() => {
    const cities = useAtomValue(citiesByCountry);

    const listStyle = useMemo<React.CSSProperties>(() => {
        return {
            overflowY: "auto",
            overflowX: "hidden",
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

    if (!Array.isArray(cities)) return null;

    if (cities.length === 0) {
        return (
            <Typography variant="body1" textAlign="center" my={2}>
                No results
            </Typography>
        );
    }

    return (
        <AutoSizer disableHeight>
            {({ width }) => (
                <List
                    id={LIST_ID}
                    width={width}
                    height={260}
                    rowCount={cities.length}
                    rowHeight={46}
                    rowRenderer={rowRenderer}
                    style={listStyle}
                />
            )}
        </AutoSizer>
    );
});

export default CitiesList;
