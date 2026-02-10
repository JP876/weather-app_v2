import { CircularProgress, styled } from "@mui/material";

import { GlassContainer } from "../styledComps";

const LoadingRouteContainer = styled(GlassContainer)(({ theme }) => ({
    width: "100%",
    height: `calc(100vh - 2 * ${theme.spacing(4)} - 3rem)`,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
}));

const LoadingRoute = () => {
    return (
        <LoadingRouteContainer>
            <CircularProgress size={64} thickness={3} />
        </LoadingRouteContainer>
    );
};

export default LoadingRoute;
