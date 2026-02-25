import { memo } from "react";
import { Stack, Typography } from "@mui/material";
import ErrorIcon from "@mui/icons-material/Error";

export type ErrorMessageProps = {
    message?: string;
    renderActions?: () => React.ReactNode;
};

const ErrorMessage = ({ message, renderActions }: ErrorMessageProps) => {
    return (
        <Stack gap={2}>
            <Stack alignItems="center" justifyContent="center" gap={1} px={8}>
                <ErrorIcon color="error" sx={{ width: "2.4rem", height: "2.4rem" }} />
                <Typography color="error" variant="h6" textAlign="center">
                    {message ||
                        "Oops! We’re having a little trouble loading things. Please try again later."}
                </Typography>
            </Stack>
            {typeof renderActions === "function" ? renderActions() : null}
        </Stack>
    );
};

export default memo(ErrorMessage);
