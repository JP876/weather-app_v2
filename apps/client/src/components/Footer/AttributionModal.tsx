import { forwardRef, useMemo } from "react";
import type { DialogProps, SlideProps } from "@mui/material";
import {
    DialogContent,
    DialogTitle,
    IconButton,
    Link,
    Slide,
    Stack,
    Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import { GlassDialog } from "../ui/styledComps";

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
                    {
                        label: "Solar System Scope",
                        href: "https://www.solarsystemscope.com/",
                    },
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

const SlideTransition = forwardRef((props: SlideProps, ref) => {
    return <Slide direction="up" ref={ref} {...props} />;
});

const AttributionModal = ({ onClose, ...rest }: AttributionModalProps) => {
    const attributions = useAttributions();

    const onClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        if (onClose && typeof onClose === "function") {
            onClose(event, "backdropClick");
        }
    };

    return (
        <GlassDialog blur={2} onClose={onClose} slots={{ transition: SlideTransition }} {...rest}>
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
        </GlassDialog>
    );
};

export default AttributionModal;
