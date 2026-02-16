import { DialogContent, DialogTitle, IconButton, Stack } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import { GlassDialog } from "../../ui/styledComps";
import { useAtom } from "jotai";
import { openSettingsAtom } from "../../../atoms";
import GeneralSettingsMain from "./GeneralSettings";

type SettingsProps = {
    children: React.ReactNode;
};

const SettingsDialog = ({ children }: SettingsProps) => {
    const [open, setOpen] = useAtom(openSettingsAtom);

    const onClose = () => {
        setOpen(false);
    };

    return (
        <GlassDialog open={open} onClose={onClose} minWidth="50rem">
            <Stack direction="row" alignItems="center" justifyContent="space-between">
                <DialogTitle>Settings</DialogTitle>
                <IconButton size="small" onClick={onClose} sx={{ mr: 2 }}>
                    <CloseIcon />
                </IconButton>
            </Stack>
            <DialogContent dividers sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {children}
            </DialogContent>
        </GlassDialog>
    );
};

const SettingsMain = () => {
    return (
        <SettingsDialog>
            <GeneralSettingsMain />
        </SettingsDialog>
    );
};

export default SettingsMain;
