import { memo, useCallback } from "react";
import Box from "@mui/material/Box";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { type SelectChangeEvent } from "@mui/material/Select";
import { styled } from "@mui/material/styles";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import { useSetAtom } from "jotai";

import type { SelectItemType } from "../../../../ui/SelectMain";
import type { CityDescriptionOptions, CityItemType } from "../../../../../atoms/types";
import { generalSettingAtom } from "../../../../../atoms";
import SelectMain from "../../../../ui/SelectMain";

const cityInfoOptions: SelectItemType<CityDescriptionOptions>[] = [
    { label: "City", value: "city" },
    { label: "City,ISO2", value: "cityiso2" },
    { label: "Country", value: "country" },
    { label: "Country,ISO2", value: "countryiso2" },
    { label: "Coordinates", value: "coordinates" },
    { label: "Local time", value: "localtime" },
    { label: "None", value: "hide" },
];

const CityListItemContainer = styled(Box)(({ theme }) => ({
    border: `1px solid ${theme.palette.divider}`,
    padding: theme.spacing(2),

    display: "grid",
    gap: theme.spacing(2),
    gridTemplateColumns: "3.2rem 1fr 1fr 1.4rem",
    gridTemplateRows: "1fr 1fr",
    gridTemplateAreas: `"flag city coordinates isFavourite"
                        "flag country clock isFavourite"`,
}));

type CheckboxSettingProps = {
    value: boolean;
    updateSettings: (event: SelectChangeEvent | React.ChangeEvent<HTMLInputElement>) => void;
};

const FlagCheckbox = memo(({ value, updateSettings }: CheckboxSettingProps) => {
    return (
        <FormControlLabel
            sx={{ ml: -1 }}
            label="Flag"
            labelPlacement="top"
            control={<Switch checked={value} onChange={updateSettings} name="flag" />}
        />
    );
});

const CityListItem = ({ value }: { value: CityItemType }) => {
    const setSettings = useSetAtom(generalSettingAtom);

    const isSelected = (positionValue: string) => {
        if (positionValue === "none") return false;
        let num = 0;
        Object.values(value).forEach((val: string) => {
            if (val === positionValue) num++;
        });
        return num > 1;
    };

    const updateSettings = useCallback(
        (event: SelectChangeEvent | React.ChangeEvent<HTMLInputElement>) => {
            let value = event.target.value as string;
            const name = event.target.name as keyof CityItemType;

            if (event.target instanceof HTMLInputElement) {
                value = event.target.checked ? "show" : "hide";
            }

            setSettings((prevValue) => {
                const prevCityItem = prevValue.cityItem || {};
                return { ...prevValue, cityItem: { ...prevCityItem, [name]: value } };
            });
        },
        [setSettings],
    );

    return (
        <CityListItemContainer>
            <Box sx={{ gridArea: "flag", alignSelf: "center", justifySelf: "start" }}>
                <FlagCheckbox value={value.flag === "show"} updateSettings={updateSettings} />
            </Box>
            <Box sx={{ gridArea: "city", display: "flex", gap: 1, alignItems: "center" }}>
                <Tooltip
                    arrow
                    disableInteractive
                    title={
                        <Typography variant="body2">
                            Appears only for cities that are capitals.
                        </Typography>
                    }
                >
                    <LocationCityIcon />
                </Tooltip>
                <SelectMain
                    name="topLeft"
                    items={cityInfoOptions}
                    value={value.topLeft}
                    onChange={updateSettings}
                    error={isSelected(value.topLeft)}
                />
            </Box>
            <Box sx={{ gridArea: "coordinates" }}>
                <SelectMain
                    name="topRight"
                    items={cityInfoOptions}
                    value={value.topRight}
                    onChange={updateSettings}
                    error={isSelected(value.topRight)}
                />
            </Box>
            <Box sx={{ gridArea: "isFavourite", alignSelf: "center" }}>
                <FavoriteBorderIcon sx={{ width: "1.4rem", height: "1.4rem" }} />
            </Box>
            <Box sx={{ gridArea: "country" }}>
                <SelectMain
                    name="bottomLeft"
                    items={cityInfoOptions}
                    value={value.bottomLeft}
                    onChange={updateSettings}
                    error={isSelected(value.bottomLeft)}
                />
            </Box>
            <Box sx={{ gridArea: "clock" }}>
                <SelectMain
                    name="bottomRight"
                    items={cityInfoOptions}
                    value={value.bottomRight}
                    onChange={updateSettings}
                    error={isSelected(value.bottomRight)}
                />
            </Box>
        </CityListItemContainer>
    );
};

export default CityListItem;
