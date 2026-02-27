import { Skeleton, Stack, type StackProps } from "@mui/material";

import getMinMax from "../../../utils/getMinMax";
import { CityListItemContainer } from "./styledComps";

export const CityListItemSkeleton = ({ containerProps }: { containerProps?: StackProps }) => {
    return (
        <CityListItemContainer
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ px: 4 }}
            {...(containerProps || {})}
            isFavourite={false}
        >
            <Stack direction="row" alignItems="center" gap={2}>
                <Skeleton width={36} height={32} sx={{ mb: -0.5 }} />
                <Stack>
                    <Skeleton width={getMinMax(72, 96)} height={32} />
                    <Skeleton width={getMinMax(72, 96)} height={20} />
                </Stack>
            </Stack>
            <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ flex: "0 0 40%" }}
            >
                <Stack gap={0.4}>
                    <Skeleton width={146} height={20} />
                    <Skeleton width={146} height={20} />
                </Stack>
                <Skeleton variant="circular" width={20} height={20} />
            </Stack>
        </CityListItemContainer>
    );
};

const CityListSkeleton = () => {
    return (
        <Stack gap={1} mt={1.5}>
            {Array.from({ length: 40 }).map((_, index) => (
                <CityListItemSkeleton key={index} />
            ))}
        </Stack>
    );
};

export default CityListSkeleton;
