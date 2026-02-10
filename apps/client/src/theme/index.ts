import { createTheme } from "@mui/material";

export const theme = createTheme({
    cssVariables: false,
    typography: {
        fontFamily: ["Roboto Mono", "Arial", "sans-serif"].join(", "),
    },
});
