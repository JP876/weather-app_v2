import { useAtomValue } from "jotai";
import { Box, CircularProgress, Tooltip, Typography } from "@mui/material";
import ErrorIcon from "@mui/icons-material/Error";

import { weatherFetchInfoAtom } from "../../../../atoms";
import useRefetchWeatherData from "../hooks/useRefetchWeatherData";

const StatusFeedback = () => {
    const { error, isLoading } = useAtomValue(weatherFetchInfoAtom);
    const refetchData = useRefetchWeatherData();

    const errorType = error ? error.type : null;
    const isError = errorType === "API_ERROR_WITH_DB_DATA" || errorType === "REFETCH_LIMIT_REACHED";

    const renderTitle = () => {
        let message = "";

        if (isLoading) {
            message = "Loading...";
        } else if (error) {
            switch (error.type) {
                case "API_ERROR_WITH_DB_DATA":
                    message = "Forecast didn't refresh. Give it another go.";
                    break;
            }
        }

        if (message === "") return "";
        return <Typography variant="body2">{message}</Typography>;
    };

    if (isLoading === "REFETCH" || isLoading === "REFRESH") {
        return <CircularProgress size={20} />;
    }

    if (!isError) return null;

    return (
        <Tooltip arrow disableInteractive title={renderTitle()}>
            <Box
                sx={{
                    height: "inherit",
                    cursor: "pointer",
                    "& svg": { height: "inherit", width: "inherit" },
                }}
                onClick={refetchData}
            >
                <ErrorIcon color={"error"} />
            </Box>
        </Tooltip>
    );
};

export default StatusFeedback;
