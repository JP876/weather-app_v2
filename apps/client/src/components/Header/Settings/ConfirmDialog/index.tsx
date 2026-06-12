import { forwardRef } from "react";
import Slide, { type SlideProps } from "@mui/material/Slide";
import Stack from "@mui/material/Stack";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import { useAtom, useSetAtom } from "jotai";

import { GlassDialog } from "../../../ui/styledComps";
import { openConfirmSettingsAtom, openSettingsAtom } from "../../../../atoms";
import useDelay from "../../../../hooks/useDelay";
import useSnackbar from "../../../../hooks/useSnackbar";
import useSaveSettings from "../../../../hooks/useSaveSettings";

const SlideTransition = forwardRef((props: SlideProps, ref) => {
    return <Slide direction="down" ref={ref} {...props} />;
});

const ConfirmDialog = () => {
    const [openConfirm, setOpenConfirm] = useAtom(openConfirmSettingsAtom);
    const setOpenSettings = useSetAtom(openSettingsAtom);

    const { loading, start } = useDelay();

    const { openSnackbar } = useSnackbar();
    const [saveSettings] = useSaveSettings();

    const handleClose = (reason?: "backdropClick" | "escapeKeyDown") => {
        if (reason === "backdropClick") return;
        setOpenConfirm(false);
        setOpenSettings(false);
    };

    const handleSaveSettings = async () => {
        await start();
        saveSettings();
        setTimeout(() => {
            openSnackbar({ message: "Done! Your settings are updated" });
            handleClose();
        }, 100);
    };

    return (
        <GlassDialog
            open={openConfirm}
            onClose={(_, reason) => handleClose(reason)}
            minWidth="36rem"
            slots={{ transition: SlideTransition }}
        >
            <Stack direction="row" alignItems="center" justifyContent="space-between">
                <DialogTitle>Settings</DialogTitle>
            </Stack>
            <DialogContent dividers sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Typography>
                    You have unsaved changes that will be lost if you close. Do you want to save
                    changes?
                </Typography>
                <Stack direction="row" justifyContent="flex-end" alignItems="center" gap={2}>
                    <Button
                        startIcon={<SaveIcon fontSize="small" />}
                        size="small"
                        variant="contained"
                        loading={loading}
                        onClick={handleSaveSettings}
                    >
                        Save
                    </Button>
                    <Button
                        startIcon={<CloseIcon fontSize="small" />}
                        size="small"
                        variant="outlined"
                        onClick={() => handleClose()}
                    >
                        Don't Save
                    </Button>
                </Stack>
            </DialogContent>
        </GlassDialog>
    );
};

export default ConfirmDialog;
