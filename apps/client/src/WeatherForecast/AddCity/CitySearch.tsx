import { memo, useMemo } from "react";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import Fuse from "fuse.js";
import { useAtom, useAtomValue, useSetAtom } from "jotai";

import { citiesFetchInfoAtom, filteredCitiesAtom, searchValueAtom } from "../../atoms";
import type { CityType } from "../../types";

const ClearSearchValue = ({ value }: { value: string }) => {
    const setValue = useSetAtom(searchValueAtom);
    const setFilteredCities = useSetAtom(filteredCitiesAtom);

    const { data: cities, isLoading } = useAtomValue(citiesFetchInfoAtom);

    const handleClear = () => {
        setValue("");
        setFilteredCities(cities);
    };

    return (
        <IconButton size="small" onClick={handleClear} disabled={isLoading || value === ""}>
            <ClearIcon />
        </IconButton>
    );
};

const CitySearch = () => {
    const [value, setValue] = useAtom(searchValueAtom);

    const setFilteredCities = useSetAtom(filteredCitiesAtom);
    const { data: cities, isLoading } = useAtomValue(citiesFetchInfoAtom);

    const fuse = useMemo(() => {
        return new Fuse<CityType>(cities || [], {
            includeScore: true,
            includeMatches: true,
            threshold: 0.5,
            keys: [
                { name: "city", weight: 1 },
                { name: "country", weight: 0.8 },
            ],
        });
    }, [cities]);

    const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setValue(value);

        if (!value) {
            setFilteredCities(cities);
        } else {
            const results = fuse.search(value);
            setFilteredCities(results.map((el) => ({ ...el.item })));
        }
    };

    return (
        <TextField
            size="small"
            variant="outlined"
            placeholder="Search city/location..."
            fullWidth
            value={value}
            onChange={handleOnChange}
            disabled={isLoading}
            slotProps={{
                input: {
                    endAdornment: (
                        <InputAdornment position="end">
                            <ClearSearchValue value={value} />
                        </InputAdornment>
                    ),
                },
            }}
        />
    );
};

export default memo(CitySearch);
