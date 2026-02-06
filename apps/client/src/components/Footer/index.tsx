import { Stack, Typography } from "@mui/material";

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
            <Stack />
            <Typography>Made with ❤️ by: Josip Popović</Typography>
        </Stack>
    );
};

export default FooterMain;
