import { useMemo } from "react";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import Fuse from "fuse.js";
import { useAtom, useAtomValue, useSetAtom } from "jotai";

import { citiesAtom, filteredCitiesAtom, searchValue } from "../../atoms";
import type { CityType } from "../../types";

const CitySearch = () => {
    const [value, setValue] = useAtom(searchValue);

    const setFilteredCities = useSetAtom(filteredCitiesAtom);
    const cities = useAtomValue(citiesAtom);

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

    const handleClear = () => {
        setValue("");
        setFilteredCities(cities);
    };

    return (
        <TextField
            size="small"
            variant="outlined"
            placeholder="Search city/location..."
            fullWidth
            value={value}
            onChange={handleOnChange}
            slotProps={{
                input: {
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton size="small" onClick={handleClear} disabled={value === ""}>
                                <ClearIcon />
                            </IconButton>
                        </InputAdornment>
                    ),
                },
            }}
        />
    );
};

export default CitySearch;
