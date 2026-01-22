import { Box, styled, type BoxProps } from "@mui/material";

export const FeedbackContainer = styled(Box, {
    shouldForwardProp: (prop) => prop !== "isLoading" && prop !== "top" && prop !== "error",
})<BoxProps & { isLoading?: boolean; error?: boolean; top?: number }>(
    ({ theme, isLoading, error, top }) => ({
        position: "absolute",
        top: top,
        left: 0,
        width: "100%",
        height: "var(--weather-forecast-routes-container-height)",
        backgroundColor: theme.alpha(theme.palette.grey[200], 0.4),
        zIndex: theme.zIndex.drawer + 1,
        display: isLoading || error ? "flex" : "none",
        justifyContent: "center",
        alignItems: "center",
    }),
);
