import { useEffect, useMemo, useRef } from "react";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import Fuse from "fuse.js";
import { useAtom } from "jotai";

import { citiesAtom, searchValue } from "../../atoms";
import type { CityType } from "../../types";

const CitySearch = () => {
    const [value, setValue] = useAtom(searchValue);
    const initialCities = useRef<CityType[] | null>(null);

    const fuse = useMemo(() => {
        return new Fuse<CityType>([], {
            includeScore: true,
            includeMatches: true,
            threshold: 0.5,
            keys: [
                { name: "city", weight: 1 },
                { name: "country", weight: 0.8 },
            ],
        });
    }, []);

    const [cities, setCities] = useAtom(citiesAtom);

    const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setValue(value);

        if (!value) {
            setCities(initialCities.current);
        } else {
            const results = fuse.search(value);
            setCities(results.map((el) => ({ ...el.item })));
        }
    };

    const handleClear = () => {
        setValue("");
        setCities(initialCities.current);
    };

    useEffect(() => {
        if (initialCities.current === null && Array.isArray(cities)) {
            initialCities.current = cities;
            fuse.setCollection(cities);
        }
    }, [cities, fuse]);

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
                        <InputAdornment position="start">
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
