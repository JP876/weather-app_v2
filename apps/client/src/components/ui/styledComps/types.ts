import type { BoxProps, DialogProps, TypographyProps } from "@mui/material";

export type GlassContainerProps = BoxProps<
    "div",
    {
        blur?: number;
        refraction?: number;
        depth?: number;
        onlyBottomShadow?: boolean;
        onlyTopShadow?: boolean;
    }
>;

export type GlassDialogProps = DialogProps & {
    blur?: number;
    refraction?: number;
    depth?: number;
    minWidth?: string;
};

export type FeedbackContainerProps = BoxProps & {
    isLoading?: boolean;
    error?: boolean;
    top?: number;
};

export type ClampedTextProps = TypographyProps<"span", { maxRows?: number }>;
