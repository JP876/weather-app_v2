import { Button } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import { useAtomValue, useSetAtom } from "jotai";

import { generalSettingAtom, openSettingsAtom, userSettingsAtom } from "../../../../atoms";

const SaveButton = () => {
    const settings = useAtomValue(generalSettingAtom);

    const setUserSettings = useSetAtom(userSettingsAtom);
    const setOpen = useSetAtom(openSettingsAtom);

    const handleSaveSettings = () => {
        setUserSettings((prevValue) => ({ ...prevValue, ...settings }));
        setTimeout(() => setOpen(false), 100);
    };

    return (
        <Button
            variant="contained"
            size="small"
            startIcon={<SaveIcon />}
            onClick={handleSaveSettings}
        >
            Save
        </Button>
    );
};

export default SaveButton;
