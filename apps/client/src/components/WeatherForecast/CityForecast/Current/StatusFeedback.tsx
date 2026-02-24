import { useAtomValue } from "jotai";
import { IconButton, Tooltip, Typography } from "@mui/material";
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

    if (!isError) return null;

    return (
        <Tooltip arrow disableInteractive title={renderTitle()}>
            <span>
                <IconButton
                    size="small"
                    disabled={errorType === "REFETCH_LIMIT_REACHED"}
                    onClick={refetchData}
                    loading={isLoading === "REFETCH"}
                >
                    <ErrorIcon
                        color={
                            isLoading || errorType === "REFETCH_LIMIT_REACHED" ? "inherit" : "error"
                        }
                    />
                </IconButton>
            </span>
        </Tooltip>
    );
};

export default StatusFeedback;
