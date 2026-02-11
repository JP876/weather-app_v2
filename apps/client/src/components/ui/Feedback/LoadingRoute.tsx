import { Box, CircularProgress, styled } from "@mui/material";

const LoadingRouteContainer = styled(Box)(({ theme }) => ({
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
