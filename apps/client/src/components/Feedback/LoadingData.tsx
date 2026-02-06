import { CircularProgress } from "@mui/material";

import { FeedbackContainer } from "../styledComps";
import ErrorMessage from "../ErrorMessage";

type LoadingDataPropsType = {
    isLoading?: boolean;
    error?: boolean;
};

const LoadingData = ({ isLoading, error }: LoadingDataPropsType) => {
    const container = document.getElementById("forecast-routes-container");

    return (
        <FeedbackContainer isLoading={isLoading} error={!!error} top={container?.scrollTop}>
            {error ? <ErrorMessage /> : <CircularProgress size={64} thickness={3} />}
        </FeedbackContainer>
    );
};

export default LoadingData;
