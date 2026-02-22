import { useEffect, useMemo, useRef, useState } from "react";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import { useSetAtom } from "jotai";
import Fuse from "fuse.js";

import type { CityType } from "../../../../types";
import { citiesByCountry } from "../../../../atoms";
import scrollCitiesList from "../../../../utils/scrollCitiesList";
import { LIST_ID } from "./CitiesList";

type CitySearchProps = {
    cities: CityType[];
    isLoading: boolean;
};

const CitySearch = ({ cities, isLoading }: CitySearchProps) => {
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
        scrollCitiesList({ behavior: "smooth" }, LIST_ID);

        if (!value) {
            setCitiesByCountry(cities);
        } else {
            const results = fuse.search(value);
            setCitiesByCountry(results.map((el) => ({ ...el.item })));
        }
    };

    const handleClear = () => {
        setValue("");
        setCitiesByCountry(cities);
        scrollCitiesList({ behavior: "smooth" }, LIST_ID);
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
            slotProps={{
                input: {
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton
                                size="small"
                                onClick={handleClear}
                                disabled={isLoading || value === ""}
                            >
                                <ClearIcon fontSize="small" />
                            </IconButton>
                        </InputAdornment>
                    ),
                },
            }}
        />
    );
};

export default CitySearch;
