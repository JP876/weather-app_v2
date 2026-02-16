import { useState } from "react";
import { Html } from "@react-three/drei";
import { useAtomValue } from "jotai";

import { selectedCityAtom } from "../../../atoms";
import { Paper, Stack, Typography } from "@mui/material";

const SelectedCityMain = () => {
    const selectedCity = useAtomValue(selectedCityAtom);

    const [hidden, setHidden] = useState(true);
    const show = Boolean(!hidden || selectedCity?.id);

    return (
        <Html
            occlude
            onOcclude={setHidden}
            transform
            style={{
                transition: "all 0.5s",
                opacity: +show,
                transform: `scale(${show ? 1 : 0.5})`,
            }}
        >
            <Paper>
                <Stack>
                    <Typography>{selectedCity?.city}</Typography>
                </Stack>
            </Paper>
        </Html>
    );
};

export default SelectedCityMain;
