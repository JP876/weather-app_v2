import { IconButton, Stack, Typography } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import { useLocation } from "wouter";

const HeaderLogo = () => {
    const [, navigate] = useLocation();

    return (
        <Stack
            direction="row"
            alignItems="center"
            onClick={() => navigate("/")}
            sx={() => ({ cursor: "pointer" })}
        >
            <Typography variant="h5">WeatherSphere</Typography>
        </Stack>
    );
};

const HeaderMain = () => {
    return (
        <Stack
            component="header"
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={(theme) => ({
                left: 0,
                top: 0,
                position: "fixed",
                width: "100%",
                height: "var(--header_height)",
                borderBottom: `1px solid ${theme.palette.grey[400]}`,
                paddingInline: theme.spacing(4),
            })}
        >
            <HeaderLogo />
            <Stack direction="row" alignItems="center">
                <IconButton size="small">
                    <SettingsIcon />
                </IconButton>
            </Stack>
        </Stack>
    );
};

export default HeaderMain;
