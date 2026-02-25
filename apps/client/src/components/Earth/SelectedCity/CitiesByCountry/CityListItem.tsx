import { memo } from "react";
import { IconButton, Stack, styled, type StackProps } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import { useAtomValue, useSetAtom } from "jotai";

import { citiesByCountry, selectedCityAtom } from "../../../../atoms";
import calcCoordToPos from "../../../../utils/calcCoordToPos";
import ClampedTextContainer from "../../../ui/ClampedTextContainer";
import type { CityType } from "../../../../types";

const Container = (props: StackProps) => (
    <Stack direction="row" alignItems="center" justifyContent="space-between" {...props} />
);

const CityListItemContainer = styled(Container, {
    shouldForwardProp: (prop) => prop !== "isSelected",
})<StackProps<"div", { isSelected: boolean }>>(({ theme, isSelected }) => ({
    height: "2.5rem",
    marginBlock: theme.spacing(0.5),
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

const CityListItemContent = memo(
    ({ isSelected, city }: { isSelected: boolean; city?: CityType }) => {
        const setSelectedCity = useSetAtom(selectedCityAtom);

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
    },
);

const CityListItem = ({ index }: { index: number }) => {
    const cities = useAtomValue(citiesByCountry);
    const selectedCity = useAtomValue(selectedCityAtom);

    const city = cities?.[index];
    const isSelected = selectedCity?.id === city?.id;

    return <CityListItemContent isSelected={isSelected} city={city} />;
};

export default CityListItem;
