import { useEffect, useMemo, useRef, useState } from "react";
import { TextField } from "@mui/material";
import Fuse from "fuse.js";
import { useAtom } from "jotai";

import { citiesAtom } from "../../atoms";
import type { CityType } from "../../types";

const CitySearch = () => {
    const [value, setValue] = useState("");
    const initialCities = useRef<CityType[] | null>(null);

    const fuse = useMemo(() => {
        return new Fuse<CityType>([], {
            includeScore: true,
            includeMatches: true,
            threshold: 0.4,
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
            console.log(results);
            setCities(results.map((el) => ({ ...el.item })));
        }
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
            placeholder="Search city..."
            fullWidth
            value={value}
            onChange={handleOnChange}
        />
    );
};

export default CitySearch;
