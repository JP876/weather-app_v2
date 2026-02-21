import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import {
    Box,
    IconButton,
    Stack,
    styled,
    TextField,
    Typography,
    type StackProps,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import { AutoSizer, List, type ListRowProps } from "react-virtualized";
import Fuse from "fuse.js";

import { citiesByCountry, selectedCityAtom } from "../../../atoms";
import calcCoordToPos from "../../../utils/calcCoordToPos";
import ClampedTextContainer from "../../ui/ClampedTextContainer";
import { db } from "../../../utils/db";
import type { CityType } from "../../../types";
import type { FetchInfoType } from "../../../atoms/types";
import type { DexieError } from "dexie";

const CitySearch = ({ cities, isLoading }: { cities: CityType[]; isLoading: boolean }) => {
    const justMounted = useRef(true);
    const [value, setValue] = useState("");

    const setCitiesByCountry = useSetAtom(citiesByCountry);

    const fuse = useMemo(() => {
        return new Fuse<CityType>(cities || [], {
            includeScore: true,
            includeMatches: true,
            threshold: 0.5,
            keys: [
                { name: "city", weight: 1 },
                { name: "population", weight: 0.8 },
            ],
        });
    }, [cities]);

    const handleOnChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setValue(value);

        if (!value) {
            setCitiesByCountry(cities);
        } else {
            const results = fuse.search(value);
            setCitiesByCountry(results.map((el) => ({ ...el.item })));
        }
    };

    useEffect(() => {
        if (Array.isArray(cities) && !justMounted.current) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setValue("");
        }
        justMounted.current = false;
    }, [cities]);

    return (
        <TextField
            size="small"
            variant="outlined"
            placeholder="Search city..."
            fullWidth
            disabled={!Array.isArray(cities) || cities.length < 2 || isLoading}
            value={value}
            onChange={handleOnChange}
        />
    );
};

const Container = (props: StackProps) => (
    <Stack direction="row" alignItems="center" justifyContent="space-between" {...props} />
);

const CityListItemContainer = styled(Container, {
    shouldForwardProp: (prop) => prop !== "isSelected",
})<StackProps<"div", { isSelected: boolean }>>(({ theme, isSelected }) => ({
    gap: theme.spacing(2),
    paddingInline: theme.spacing(1.5),
    paddingBlock: theme.spacing(0.5),
    borderRadius: theme.shape.borderRadius,
    transition: theme.transitions.create(["background-color", "border-color"]),
    border: `1px solid transparent`,
    cursor: "pointer",

    ...(isSelected && {
        borderColor: theme.palette.primary.main,
        cursor: "default",
    }),

    "&:hover": {
        backgroundColor: theme.alpha(theme.palette.background.default, 0.2),
    },

    "& svg": {
        height: "1.2rem",
        width: "1.2rem",
    },
}));

const CityListItem = ({ index }: { index: number }) => {
    const cities = useAtomValue(citiesByCountry);
    const [selectedCity, setSelectedCity] = useAtom(selectedCityAtom);

    const city = cities?.[index] || null;
    const isSelected = selectedCity?.id === city?.id;

    const handleOnClick = () => {
        if (!city || isSelected) {
            if (!city) console.error("City info not found");
            return null;
        }
        const position = calcCoordToPos({ lat: +city.lat, lng: +city.lng });
        setSelectedCity({ ...city, position });
    };

    return (
        <CityListItemContainer onClick={handleOnClick} isSelected={isSelected}>
            <Stack direction="row" alignItems="center" gap={0.8}>
                {city?.capital === "primary" ? <LocationCityIcon fontSize="small" /> : null}
                <ClampedTextContainer variant="body1">{city?.city || ""}</ClampedTextContainer>
            </Stack>
            <IconButton size="small" disabled={isSelected}>
                <VisibilityIcon fontSize="small" />
            </IconButton>
        </CityListItemContainer>
    );
};

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
                    width={width}
                    height={260}
                    rowCount={cities.length}
                    rowHeight={44}
                    rowRenderer={rowRenderer}
                    style={listStyle}
                />
            )}
        </AutoSizer>
    );
});

const CitiesByCountry = ({ country }: { country: string }) => {
    const setCitiesByCountry = useSetAtom(citiesByCountry);
    const [fetchCitiesInfo, setFetchCitiesInfo] = useState<FetchInfoType<CityType[]>>({
        data: null,
        isLoading: false,
        error: false,
    });

    useEffect(() => {
        if (country) {
            (async () => {
                setFetchCitiesInfo((prevValue) => ({
                    ...prevValue,
                    error: false,
                    isLoading: true,
                }));
                try {
                    const cities = await db.cities
                        .filter((city) => city.country === country)
                        .reverse()
                        .sortBy("population");

                    setFetchCitiesInfo({ data: cities, isLoading: false, error: false });
                    setCitiesByCountry(cities);
                } catch (err: unknown) {
                    const error = err as DexieError;
                    setFetchCitiesInfo({
                        data: null,
                        isLoading: false,
                        error: {
                            type: "DB",
                            name: error.name,
                            msg: error.message,
                            cause: error.cause,
                        },
                    });
                }
            })();
        }
    }, [country, setCitiesByCountry]);

    return (
        <Stack gap={2}>
            <CitySearch cities={fetchCitiesInfo.data || []} isLoading={fetchCitiesInfo.isLoading} />
            <CitiesList />
        </Stack>
    );
};

export default memo(CitiesByCountry);
