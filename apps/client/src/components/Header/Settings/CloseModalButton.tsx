import { memo } from "react";
import { Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useSetAtom } from "jotai";

import { openSettingsAtom } from "../../../atoms";

const CloseModalButton = () => {
    const setOpen = useSetAtom(openSettingsAtom);

    return (
        <Button
            size="small"
            variant="outlined"
            startIcon={<CloseIcon />}
            onClick={() => setOpen(false)}
        >
            Close
        </Button>
    );
};

export default memo(CloseModalButton);
