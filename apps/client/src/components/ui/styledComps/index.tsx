import { Box, styled, Typography, type BoxProps, type TypographyProps } from "@mui/material";

export const FeedbackContainer = styled(Box, {
    shouldForwardProp: (prop) => prop !== "isLoading" && prop !== "top" && prop !== "error",
})<BoxProps & { isLoading?: boolean; error?: boolean; top?: number }>(
    ({ theme, isLoading, error, top }) => ({
        position: "absolute",
        top: top,
        left: 0,
        width: "100%",
        height: "var(--routes-container-height)",
        backgroundColor: theme.alpha(theme.palette.grey[200], 0.4),
        zIndex: theme.zIndex.drawer + 1,
        display: isLoading || error ? "flex" : "none",
        justifyContent: "center",
        alignItems: "center",
    }),
);

export type ClampedTextProps = TypographyProps<"span", { maxRows?: number }>;

export const ClampedText = styled(Typography, {
    shouldForwardProp: (prop) => prop !== "maxRows",
})<ClampedTextProps>(({ maxRows = 1 }) => ({
    whiteSpace: "wrap",
    wordBreak: "break-all",
    display: "-webkit-box",
    WebkitBoxOrient: "vertical",
    WebkitLineClamp: maxRows,
    overflow: "hidden",
    textOverflow: "ellipsis",
}));
