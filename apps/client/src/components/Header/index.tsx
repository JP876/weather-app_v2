import { IconButton, Stack, styled, Typography } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import PanoramaPhotosphereIcon from "@mui/icons-material/PanoramaPhotosphere";
import { useLocation } from "wouter";
import { GlassContainer } from "../ui/styledComps";

const HeaderLogo = () => {
    const [, navigate] = useLocation();

    return (
        <Stack
            direction="row"
            alignItems="center"
            onClick={() => navigate("/")}
            sx={() => ({ cursor: "pointer", gap: 1.4 })}
        >
            <PanoramaPhotosphereIcon color="primary" />
            <Typography variant="h5">WeatherSphere</Typography>
        </Stack>
    );
};

const HeaderContainer = styled(GlassContainer)(({ theme }) => ({
    left: 0,
    top: 0,
    position: "fixed",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    zIndex: 1,
    width: "100%",
    height: "var(--header_height)",
    borderBottom: `1px solid ${theme.palette.grey[400]}`,
    paddingInline: theme.spacing(4),
}));

const HeaderMain = () => {
    return (
        <HeaderContainer component="header">
            <HeaderLogo />
            <Stack direction="row" alignItems="center">
                <IconButton size="small">
                    <SettingsIcon />
                </IconButton>
            </Stack>
        </HeaderContainer>
    );
};

export default HeaderMain;
