import { Button } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import { useSetAtom } from "jotai";

import { openSettingsAtom } from "../../../../atoms";
import useSnackbar from "../../../../hooks/useSnackbar";
import useDelay from "../../../../hooks/useDelay";
import useSaveSettings from "../../../../hooks/useSaveSettings";

const SaveButton = () => {
    const { loading, start } = useDelay();

    const setOpen = useSetAtom(openSettingsAtom);

    const { openSnackbar } = useSnackbar();
    const [saveSettings] = useSaveSettings();

    const handleSaveSettings = async () => {
        await start();
        saveSettings();
        setTimeout(() => {
            openSnackbar({ message: "Done! Your settings are updated" });
            setOpen(false);
        }, 100);
    };

    return (
        <Button
            variant="contained"
            size="small"
            startIcon={<SaveIcon />}
            onClick={handleSaveSettings}
            loading={loading}
        >
            Save
        </Button>
    );
};

export default SaveButton;
