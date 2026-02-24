import { useAtomValue } from "jotai";
import { IconButton, Tooltip, Typography } from "@mui/material";
import ErrorIcon from "@mui/icons-material/Error";

import useFetchWeatherData from "../hooks/useFetchWeatherData";
import useCityInfo from "../hooks/useCityInfo";
import { userSettingsAtom, weatherFetchInfoAtom } from "../../../../atoms";
import useSnackbar from "../../../../hooks/useSnackbar";

const StatusFeedback = () => {
    const { error, isLoading } = useAtomValue(weatherFetchInfoAtom);
    const { handleRefetch } = useFetchWeatherData();

    const cityInfo = useCityInfo();
    const userSettings = useAtomValue(userSettingsAtom);

    const errorType = error ? error.type : null;
    const isError = errorType === "API_ERROR_WITH_DB_DATA" || errorType === "REFETCH_LIMIT_REACHED";

    const { openSnackbar } = useSnackbar();

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

    const handleClick = async () => {
        if (!cityInfo) {
            console.error("City info not found");
            return null;
        }

        const [error] = await handleRefetch({
            ...cityInfo,
            units: userSettings?.units || "metric",
        });

        if (error?.type === "REFETCH_LIMIT_REACHED") {
            openSnackbar({ severity: "error", message: error.msg });
        }
    };

    if (!isError) return null;

    return (
        <Tooltip arrow disableInteractive title={renderTitle()}>
            <span>
                <IconButton
                    size="small"
                    disabled={errorType === "REFETCH_LIMIT_REACHED"}
                    onClick={handleClick}
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
