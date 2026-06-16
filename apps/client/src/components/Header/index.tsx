import { lazy, Suspense } from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import SettingsIcon from "@mui/icons-material/Settings";
import { useLocation } from "wouter";
import { useSetAtom } from "jotai";

import { GlassContainer } from "../ui/styledComps";
import { openSettingsAtom } from "../../atoms";
import Clock from "../ui/Clock";

const SettingsMain = lazy(() => import("./Settings"));

const HeaderLogo = () => {
    const [, navigate] = useLocation();

    return (
        <Stack
            direction="row"
            alignItems="center"
            onClick={() => navigate("/")}
            sx={() => ({ cursor: "pointer", gap: 1.4 })}
        >
            <Box component="img" src="/earth.svg" sx={{ width: "1.8rem", height: "1.8rem" }} />
            <Typography variant="h5">WeatherSphere</Typography>
        </Stack>
    );
};

const HeaderContainer = styled(GlassContainer)(({ theme }) => ({
    gridRowStart: 1,
    gridColumnStart: 1,
    gridColumnEnd: -1,

    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    zIndex: 1,
    width: "100%",
    height: "var(--header-height)",
    borderBottom: `1px solid ${theme.palette.grey[400]}`,
    paddingInline: theme.spacing(4),
}));

const HeaderMain = () => {
    const setOpen = useSetAtom(openSettingsAtom);

    return (
        <HeaderContainer component="header" onlyBottomShadow>
            <HeaderLogo />

            <Stack direction="row" alignItems="center" gap={2}>
                <Clock />
                <Tooltip arrow disableInteractive title="Settings">
                    <IconButton size="small" onClick={() => setOpen(true)}>
                        <SettingsIcon />
                    </IconButton>
                </Tooltip>
            </Stack>

            <Suspense fallback={null}>
                <SettingsMain />
            </Suspense>
        </HeaderContainer>
    );
};

export default HeaderMain;
