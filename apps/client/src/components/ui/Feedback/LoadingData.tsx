import { CircularProgress } from "@mui/material";

import { FeedbackContainer } from "../styledComps";
import ErrorMessage, { type ErrorMessageProps } from "../ErrorMessage";

type LoadingDataPropsType = ErrorMessageProps & {
    isLoading?: boolean;
    error?: boolean;
};

const LoadingData = ({ isLoading, error, renderActions }: LoadingDataPropsType) => {
    const container = document.getElementById("forecast-routes-container");

    return (
        <FeedbackContainer isLoading={isLoading} error={!!error} top={container?.scrollTop}>
            {error ? (
                <ErrorMessage renderActions={renderActions} />
            ) : (
                <CircularProgress size={64} thickness={3} />
            )}
        </FeedbackContainer>
    );
};

export default LoadingData;
