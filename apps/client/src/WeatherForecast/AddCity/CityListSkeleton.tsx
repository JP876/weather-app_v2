import { Skeleton, Stack } from "@mui/material";

import { CityListItemContainer } from "./CityList";
import getMinMax from "../../utils/getMinMax";

const CityListSkeleton = () => {
    return (
        <Stack gap={1} mt={1.5}>
            {Array.from({ length: 40 }).map((_, index) => (
                <CityListItemContainer
                    key={index}
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{ px: 4 }}
                    isFavourite={false}
                >
                    <Stack direction="row" alignItems="center" gap={2}>
                        <Skeleton width={36} height={32} sx={{ mb: -0.5 }} />
                        <Stack>
                            <Skeleton width={getMinMax(48, 72)} height={32} />
                            <Skeleton width={getMinMax(48, 72)} height={20} />
                        </Stack>
                    </Stack>
                    <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                        sx={{ flex: "0 0 40%" }}
                    >
                        <Skeleton width={146} height={20} />
                        <Skeleton variant="circular" width={20} height={20} />
                    </Stack>
                </CityListItemContainer>
            ))}
        </Stack>
    );
};

export default CityListSkeleton;
