import { memo, useMemo, useState } from "react";
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

const useAttributions = () => {
    return useMemo(() => {
        return [
            {
                label: "Weather data provided by:",
                links: [{ label: "OpenWeather", href: "https://openweathermap.org/" }],
            },
            {
                label: "World Cities data provided by:",
                links: [{ label: "Simplemaps.com", href: "https://simplemaps.com/" }],
            },
            {
                label: "Earth textures provided by:",
                links: [
                    { label: "Solar System Scope", href: "https://www.solarsystemscope.com/" },
                    {
                        label: "Natural Earth III, Tom Patterson",
                        href: "https://www.shadedrelief.com",
                    },
                ],
            },
        ];
    }, []);
};

type AttributionModalProps = {} & DialogProps;

const AttributionModal = ({ ...rest }: AttributionModalProps) => {
    const attributions = useAttributions();

    const onClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        if (rest.onClose && typeof rest.onClose === "function") {
            rest.onClose(event, "backdropClick");
        }
    };

    return (
        <Dialog
            sx={(theme) => ({
                "& .MuiPaper-root": {
                    minWidth: "30rem",
                    backgroundColor: "transparent",
                    backdropFilter: `blur(${theme.spacing(6)})`,
                    WebkitBackdropFilter: `blur(${theme.spacing(6)})`,
                    boxShadow: `0 8px 32px rgba(0, 0, 0, 0.1),
                            inset 0 1px 0 rgba(255, 255, 255, 0.5),
                            inset 0 -1px 0 rgba(255, 255, 255, 0.1),
                            inset 0 0 ${4 * 2}px ${4}px rgba(255, 255, 255, ${4 / 10})
                    `,
                },
            })}
            {...rest}
        >
            <Stack direction="row" alignItems="center" justifyContent="space-between">
                <DialogTitle>Attributions</DialogTitle>
                <IconButton size="small" onClick={onClick} sx={{ mr: 2 }}>
                    <CloseIcon />
                </IconButton>
            </Stack>

            <DialogContent dividers sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {attributions.map(({ label, links }) => (
                    <Stack key={label}>
                        <Typography variant="body1">{label}</Typography>
                        {links.map((link) => (
                            <Link
                                key={link.label}
                                target="_blank"
                                rel="noreferrer"
                                href={link.href}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </Stack>
                ))}
            </DialogContent>
        </Dialog>
    );
};

const FooterMain = () => {
    const [open, setOpen] = useState(false);

    return (
        <>
            <FooterContainer component="footer" onlyTopShadow>
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
