import IconButton from "@mui/material/IconButton";
import { useColorScheme } from "@mui/material/styles";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";

const ThemeMode = () => {
    const { mode, setMode } = useColorScheme();

    const handleClick = () => {
        setMode(mode === "dark" || mode === "system" ? "light" : "dark");
    };

    return (
        <IconButton
            onClick={handleClick}
            size="small"
            sx={(theme) => ({
                width: "1.5rem",
                height: "1.5rem",
                position: "relative",

                "& svg": {
                    position: "absolute",
                    transition: theme.transitions.create(["opacity"]),
                },
            })}
        >
            <LightModeIcon sx={{ opacity: +(mode === "dark" || mode === "system") }} />
            <DarkModeIcon sx={{ opacity: +(mode === "light") }} />
        </IconButton>
    );
};

export default ThemeMode;
