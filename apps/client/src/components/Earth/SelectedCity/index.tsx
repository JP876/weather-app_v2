import { memo } from "react";
import { styled } from "@mui/material";
import { useAtomValue } from "jotai";

import { selectedCityAtom } from "../../../atoms";
import SelectedCityDetails from "./SelectedCityDetails";
import { GlassContainer } from "../../ui/styledComps";
import { MARGIN_INLINE } from "../../../consts";

/* 
<group ref={groupRef}>
    <Html
        position={selectedCity.position}
        occlude={true}
        onOcclude={setHidden}
        style={{
            transition: "all 0.5s",
            opacity: +show,
            transform: `scale(${show ? 1 : 0.5})`,
        }}
    >
        <SelectedCityDetails city={selectedCity} closeDetails={closeDetails} />
    </Html>
</group>
*/

const SelectedCityContainer = styled(GlassContainer)(({ theme }) => ({
    position: "absolute",
    top: "var(--content-top-position)",
    right: theme.spacing(MARGIN_INLINE),
    borderRadius: theme.shape.borderRadius,
    zIndex: 10,
    width: "20vw",
    height: "60vh",
}));

const SelectedCityMain = () => {
    const selectedCity = useAtomValue(selectedCityAtom);

    if (!selectedCity) return null;

    return (
        <SelectedCityContainer>
            <SelectedCityDetails />
        </SelectedCityContainer>
    );
};

export default memo(SelectedCityMain);
