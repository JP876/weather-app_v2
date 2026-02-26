import { forwardRef, useEffect } from "react";
import {
    DialogContent,
    DialogTitle,
    IconButton,
    Slide,
    Stack,
    type SlideProps,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useAtom, useAtomValue, useSetAtom } from "jotai";

import { GlassDialog } from "../../ui/styledComps";
import {
    generalSettingAtom,
    initialCityDescription,
    openSettingsAtom,
    userSettingsAtom,
} from "../../../atoms";
import SettingsNavigation from "./SettingsNavigation";

type SettingsProps = {
    children: React.ReactNode;
};

const SlideTransition = forwardRef((props: SlideProps, ref) => {
    return <Slide direction="down" ref={ref} {...props} />;
});

const SettingsDialog = ({ children }: SettingsProps) => {
    const [open, setOpen] = useAtom(openSettingsAtom);

    const userSettings = useAtomValue(userSettingsAtom);
    const setGeneralSettings = useSetAtom(generalSettingAtom);

    const onClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        if (open) {
            // set initial settings
            setGeneralSettings({
                dateFormat: userSettings.dateFormat || "HH:mm:ss dd/MMM/yyyy",
                leftClick: userSettings.leftClick || "add",
                middleClick: userSettings.middleClick || "navigate",
                units: userSettings.units || "metric",
                cityItem: userSettings.cityItem || initialCityDescription,
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    return (
        <GlassDialog
            open={open}
            onClose={onClose}
            minWidth="50rem"
            slots={{ transition: SlideTransition }}
        >
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
            <SettingsNavigation />
        </SettingsDialog>
    );
};

export default SettingsMain;
