import { Stack, styled, type StackProps } from "@mui/material";

export const CityListItemContainer = styled(Stack, {
    shouldForwardProp: (prop) => prop !== "isFavourite",
})<StackProps<"div", { isFavourite: boolean }>>(({ theme, isFavourite }) => ({
    paddingInline: theme.spacing(2),
    cursor: "pointer",
    backgroundColor: isFavourite ? theme.palette.grey[100] : "transparent",
    transition: theme.transitions.create(["background-color", "border-color"]),
    border: `1px solid ${isFavourite ? theme.palette.primary.dark : "transparent"}`,
    borderRadius: theme.shape.borderRadius,
    gap: theme.spacing(4),

    "&:hover": {
        backgroundColor: theme.palette.grey[200],
    },
}));
