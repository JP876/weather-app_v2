import { Box, styled, Typography, type BoxProps, type TypographyProps } from "@mui/material";

export const GlassContainer = styled(Box)<BoxProps>(({ theme }) => ({
    background: "rgba(255, 255, 255, 0.2)",
    backdropFilter: `blur(${theme.spacing(4)})`,
    WebkitBackdropFilter: `blur(${theme.spacing(4)})`,
    boxShadow: `0 8px 32px rgba(0, 0, 0, 0.1),
                inset 0 1px 0 rgba(255, 255, 255, 0.5),
                inset 0 -1px 0 rgba(255, 255, 255, 0.1),
                inset 0 0 20px 10px rgba(255, 255, 255, 1)`,

    "&::before": {
        content: "''",
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: "1px",
        background: `linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.8),
            transparent
        )`,
    },

    "&::after": {
        content: "''",
        position: "absolute",
        top: 0,
        left: 0,
        width: "1px",
        height: "100%",
        background: `linear-gradient(
            180deg,
            rgba(255, 255, 255, 0.8),
            transparent,
            rgba(255, 255, 255, 0.3)
        )`,
    },
}));

export const FeedbackContainer = styled(GlassContainer, {
    shouldForwardProp: (prop) => prop !== "isLoading" && prop !== "top" && prop !== "error",
})<BoxProps & { isLoading?: boolean; error?: boolean; top?: number }>(
    ({ theme, isLoading, error, top }) => ({
        position: "absolute",
        top: top,
        left: 0,
        width: "100%",
        height: "var(--routes-container-height)",
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
