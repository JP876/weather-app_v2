import { createTheme } from "@mui/material";

export const theme = createTheme({
    cssVariables: false,
    palette: {
        mode: "dark",
    },
    typography: {
        fontFamily: ["Roboto Mono", "Arial", "sans-serif"].join(", "),
    },
});
