import { Link, Stack, Typography } from "@mui/material";

const FooterMain = () => {
    return (
        <Stack
            component="footer"
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={(theme) => ({
                left: 0,
                bottom: 0,
                position: "fixed",
                width: "100%",
                height: "var(--footer_height)",
                borderTop: `1px solid ${theme.palette.grey[400]}`,
                paddingInline: theme.spacing(4),
            })}
        >
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
        </Stack>
    );
};

export default FooterMain;
