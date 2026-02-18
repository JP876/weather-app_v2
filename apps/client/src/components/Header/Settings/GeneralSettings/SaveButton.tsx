import { Button } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import { useAtomValue, useSetAtom } from "jotai";

import { generalSettingAtom, openSettingsAtom, userSettingsAtom } from "../../../../atoms";
import useSnackbar from "../../../../hooks/useSnackbar";
import useDelay from "../../../../hooks/useDelay";

const SaveButton = () => {
    const settings = useAtomValue(generalSettingAtom);
    const { loading, start } = useDelay();

    const setUserSettings = useSetAtom(userSettingsAtom);
    const setOpen = useSetAtom(openSettingsAtom);

    const { openSnackbar } = useSnackbar();

    const handleSaveSettings = async () => {
        await start();
        setUserSettings((prevValue) => ({ ...prevValue, ...settings }));
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
