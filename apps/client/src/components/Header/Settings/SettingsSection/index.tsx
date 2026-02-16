import { Box, Stack, Typography } from "@mui/material";

const SettingsSection = ({ label, children }: { label: string; children: React.ReactNode }) => {
    return (
        <Box sx={{ display: "grid", gridTemplateColumns: "20% 1fr" }}>
            <Typography variant="h6">{label}</Typography>
            <Stack gap={2} sx={{ width: "100%" }}>
                {children}
            </Stack>
        </Box>
    );
};

export default SettingsSection;
