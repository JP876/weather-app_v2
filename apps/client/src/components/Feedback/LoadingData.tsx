import { CircularProgress } from "@mui/material";

import { FeedbackContainer } from "../styledComps";
import ErrorMessage from "../ErrorMessage";

type FeedbackPropsType = {
    isLoading?: boolean;
    error?: boolean;
};

const FeedbackMain = ({ isLoading, error }: FeedbackPropsType) => {
    const container = document.getElementById("forecast-routes-container");

    return (
        <FeedbackContainer isLoading={isLoading} error={!!error} top={container?.scrollTop}>
            {error ? <ErrorMessage /> : <CircularProgress size={64} thickness={3} />}
        </FeedbackContainer>
    );
};

export default FeedbackMain;
