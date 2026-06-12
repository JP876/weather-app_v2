import { memo } from "react";
import { Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import useCloseSettings from "../../../hooks/useCloseSettings";

const CloseModalButton = () => {
    const [onClose] = useCloseSettings();

    return (
        <Button size="small" variant="outlined" startIcon={<CloseIcon />} onClick={onClose}>
            Close
        </Button>
    );
};

export default memo(CloseModalButton);
