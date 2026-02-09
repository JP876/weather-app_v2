import { Link, Stack, styled, Typography } from "@mui/material";

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

const FooterMain = () => {
    return (
        <FooterContainer component="footer">
            <Stack gap={0.2}>
                <Typography variant="body2">
                    Weather data provided by:{" "}
                    <Link target="_blank" rel="noreferrer" href="https://openweathermap.org/">
                        OpenWeather
                    </Link>
                </Typography>
                <Typography variant="body2">
                    World Cities data provided by:{" "}
                    <Link target="_blank" rel="noreferrer" href="https://simplemaps.com/">
                        Simplemaps.com
                    </Link>
                </Typography>
            </Stack>
            <Typography variant="body1">Made with ❤️ by: Josip Popović</Typography>
        </FooterContainer>
    );
};

export default FooterMain;
