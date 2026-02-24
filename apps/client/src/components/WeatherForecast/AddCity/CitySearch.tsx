import { memo } from "react";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import { useAtom, useAtomValue, useSetAtom } from "jotai";

import { citiesFetchInfoAtom, searchValueAtom } from "../../../atoms";
import scrollCitiesList from "../../../utils/scrollCitiesList";
import { LIST_ID } from "./CityList";

const ClearSearchValue = ({ value }: { value: string }) => {
    const setValue = useSetAtom(searchValueAtom);

    const { isLoading, error } = useAtomValue(citiesFetchInfoAtom);

    const handleClear = () => {
        scrollCitiesList({}, LIST_ID);
        setValue("");
    };

    return (
        <IconButton
            size="small"
            onClick={handleClear}
            disabled={isLoading === "INITIAL" || !!error || value === ""}
        >
            <ClearIcon />
        </IconButton>
    );
};

const CitySearch = () => {
    const [value, setValue] = useAtom(searchValueAtom);

    const { isLoading, error } = useAtomValue(citiesFetchInfoAtom);

    const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;

        scrollCitiesList({ behavior: "auto" }, LIST_ID);
        setValue(value);
    };

    return (
        <TextField
            size="small"
            variant="outlined"
            placeholder="Search city/location..."
            fullWidth
            value={value}
            onChange={handleOnChange}
            disabled={isLoading === "INITIAL" || !!error}
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
