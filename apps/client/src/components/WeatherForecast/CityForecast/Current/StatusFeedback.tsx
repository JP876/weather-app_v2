import { useAtomValue } from "jotai";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import ErrorIcon from "@mui/icons-material/Error";
import { format } from "date-fns";

import { lastTimeUpdatedAtom, weatherFetchInfoAtom } from "../../../../atoms";
import useRefetchWeatherData from "../hooks/useRefetchWeatherData";

const StatusFeedback = () => {
    const dt = useAtomValue(lastTimeUpdatedAtom);
    const { error, isLoading } = useAtomValue(weatherFetchInfoAtom);

    const refetchData = useRefetchWeatherData();

    const errorType = error ? error.type : null;
    const isError =
        errorType === "API_ERROR_WITH_DB_DATA" ||
        errorType === "REFETCH_LIMIT_REACHED" ||
        errorType === "NETWORK_ERROR";

    const renderTitle = () => {
        let message = "";

        if (isLoading) {
            message = "Loading...";
        } else if (error) {
            switch (error.type) {
                case "API_ERROR_WITH_DB_DATA":
                    message = "Forecast didn't refresh. Give it another go.";
                    break;
                case "NETWORK_ERROR":
                    message = "Looks like you're not connected. Try again once you're online.";
                    break;
            }
        }

        if (message === "") return "";
        return <Typography variant="body2">{message}</Typography>;
    };

    if (isLoading === "REFETCH" || isLoading === "REFRESH") {
        return (
            <Stack direction="row" alignItems="center" justifyContent="center">
                <CircularProgress size={16} />
            </Stack>
        );
    }

    if (!isError) {
        if (dt) {
            return <Typography variant="caption">{format(dt, "HH:mm")}</Typography>;
        } else {
            return null;
        }
    }

    return (
        <Tooltip arrow disableInteractive title={renderTitle()}>
            <Stack
                direction="row"
                alignItems="center"
                justifyContent="center"
                sx={{
                    height: "inherit",
                    cursor: "pointer",
                    "& svg": { height: "1rem", width: "1rem" },
                }}
                onClick={refetchData}
            >
                <ErrorIcon color={"error"} />
            </Stack>
        </Tooltip>
    );
};

export default StatusFeedback;
