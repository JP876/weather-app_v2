import { Box, styled, Typography, type BoxProps, type TypographyProps } from "@mui/material";

const BLUR_VALUE = 6;
const REFRACTION = 0.14;
const DEPTH = 4;

type GlassContainerProps = {
    blur?: number;
    refraction?: number;
    depth?: number;
    onlyBottomShadow?: boolean;
    onlyTopShadow?: boolean;
};

// https://hype4.academy/tools/glassmorphism-generator
export const GlassContainer = styled(Box, {
    shouldForwardProp: (props) =>
        props !== "blur" &&
        props !== "refraction" &&
        props !== "depth" &&
        props !== "onlyBottomShadow" &&
        props !== "onlyTopShadow",
})<BoxProps<"div", GlassContainerProps>>(
    ({ theme, blur, refraction, depth, onlyBottomShadow, onlyTopShadow }) => ({
        background: `rgba(255, 255, 255, ${refraction ?? REFRACTION})`,
        backdropFilter: `blur(${theme.spacing(blur ?? BLUR_VALUE)})`,
        WebkitBackdropFilter: `blur(${theme.spacing(blur ?? BLUR_VALUE)})`,
        boxShadow: `0 8px 32px rgba(0, 0, 0, 0.1),
                inset 0 1px 0 rgba(255, 255, 255, 0.5),
                inset 0 -1px 0 rgba(255, 255, 255, 0.1),
                inset 0 0 ${depth ?? DEPTH * 2}px ${depth ?? DEPTH}px rgba(255, 255, 255, ${depth ?? DEPTH / 10})
        `,

        ...(onlyBottomShadow && {
            boxShadow: `
                inset 0 ${-DEPTH * 2}px ${depth ?? DEPTH * 2}px ${depth ?? -DEPTH}px rgba(255, 255, 255, ${depth ?? DEPTH / 10})
            `,
        }),

        ...(onlyTopShadow && {
            boxShadow: `
                inset 0 ${DEPTH * 2}px ${depth ?? DEPTH * 2}px ${depth ?? -DEPTH}px rgba(255, 255, 255, ${depth ?? DEPTH / 10})
            `,
        }),

        ...(!onlyBottomShadow &&
            !onlyTopShadow && {
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
            }),
    }),
);

export const FeedbackContainer = styled(Box, {
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
        backgroundColor: theme.alpha(theme.palette.background.default, 0.4),
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
