import { memo, useState } from "react";
import {
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    Link,
    Stack,
    styled,
    Typography,
    type DialogProps,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AttributionIcon from "@mui/icons-material/Attribution";

import { GlassContainer } from "../ui/styledComps";

const FooterContainer = styled(GlassContainer)(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    left: 0,
    bottom: 0,
    zIndex: 1,
    position: "fixed",
    width: "100%",
    height: "var(--footer_height)",
    borderTop: `1px solid ${theme.palette.grey[400]}`,
    paddingInline: theme.spacing(4),
}));

type AttributionModalProps = {} & DialogProps;

const AttributionModal = ({ ...rest }: AttributionModalProps) => {
    const onClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        if (rest.onClose && typeof rest.onClose === "function") {
            rest.onClose(event, "backdropClick");
        }
    };

    return (
        <Dialog {...rest}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
                <DialogTitle>Attributions</DialogTitle>
                <IconButton size="small" onClick={onClick} sx={{ mr: 2 }}>
                    <CloseIcon />
                </IconButton>
            </Stack>
            <DialogContent dividers sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <Typography variant="body1">
                    Weather data provided by:{" "}
                    <Link target="_blank" rel="noreferrer" href="https://openweathermap.org/">
                        OpenWeather
                    </Link>
                </Typography>
                <Typography variant="body1">
                    World Cities data provided by:{" "}
                    <Link target="_blank" rel="noreferrer" href="https://simplemaps.com/">
                        Simplemaps.com
                    </Link>
                </Typography>
                <Typography variant="body1">
                    Earth textures provided by:{" "}
                    <Link target="_blank" rel="noreferrer" href="https://www.solarsystemscope.com/">
                        Solar System Scope
                    </Link>
                </Typography>
            </DialogContent>
        </Dialog>
    );
};

const FooterMain = () => {
    const [open, setOpen] = useState(false);

    return (
        <>
            <FooterContainer component="footer">
                <Button
                    startIcon={<AttributionIcon />}
                    size="small"
                    variant="outlined"
                    onClick={() => setOpen(true)}
                >
                    Attributions
                </Button>
                <Typography variant="body1">Made with ❤️ by: Josip Popović</Typography>
            </FooterContainer>

            <AttributionModal open={open} onClose={() => setOpen(false)} />
        </>
    );
};

export default memo(FooterMain);
