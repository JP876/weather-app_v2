import { memo } from "react";
import { Slide, styled } from "@mui/material";
import { useAtomValue } from "jotai";

import { selectedCityAtom } from "../../../atoms";
import SelectedCityDetails from "./SelectedCityDetails";
import { GlassContainer } from "../../ui/styledComps";
import { NUM_OF_COLUMNS } from "../../../consts";

const SelectedCityContainer = styled(GlassContainer)(({ theme }) => ({
    zIndex: 1,
    borderRadius: theme.shape.borderRadius,
    marginRight: theme.spacing(4),

    gridRowStart: 2,
    gridColumnStart: NUM_OF_COLUMNS - 2,
    gridColumnEnd: NUM_OF_COLUMNS + 1,

    [theme.breakpoints.down("xl")]: {
        gridColumnStart: NUM_OF_COLUMNS - 3,
    },
    [theme.breakpoints.down("lg")]: {
        gridColumnStart: NUM_OF_COLUMNS - 3,
    },
    [theme.breakpoints.down("md")]: {
        display: "none",
    },
}));

const SelectedCityMain = () => {
    const selectedCity = useAtomValue(selectedCityAtom);

    return (
        <Slide direction="left" in={!!selectedCity} mountOnEnter unmountOnExit>
            <SelectedCityContainer>
                <SelectedCityDetails />
            </SelectedCityContainer>
        </Slide>
    );
};

export default memo(SelectedCityMain);
