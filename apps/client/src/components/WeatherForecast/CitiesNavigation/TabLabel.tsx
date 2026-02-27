import { useSetAtom } from "jotai";
import { useLocation } from "wouter";
import { Box, Stack } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";

import { favouriteCitiesAtom } from "../../../atoms";
import ClampedTextContainer from "../../ui/ClampedTextContainer";
import withCatch from "../../../utils/withCatch";
import { db } from "../../../utils/db";

type TabLabelProps = {
    id: number | string;
    city: string;
    index: number;
    prevCityId: number | string | null;
};

const TabLabel = ({ id, city, index, prevCityId }: TabLabelProps) => {
    const setFavouriteCities = useSetAtom(favouriteCitiesAtom);

    const [path, navigate] = useLocation();
    const cId = path.split("/")?.[1];

    const deleteFromFavourites = () => {
        setFavouriteCities((prevState) => {
            const nextValue = (prevState || []).filter(
                (location) => location.id.toString() !== id.toString(),
            );
            return nextValue;
        });
    };

    const handleDeleteLocation = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        event.stopPropagation();

        if (!id) {
            setFavouriteCities((prevValue) => (prevValue || []).filter((_, i) => i !== index));
            return null;
        }

        (async () => {
            await withCatch(db.weatherData.delete(+id));
            const same = id.toString() === cId;

            if (same) {
                navigate(`/${prevCityId || ""}`, { replace: true });
                setTimeout(deleteFromFavourites, 200);
            } else {
                deleteFromFavourites();
            }
        })();
    };

    return (
        <Stack direction="row" alignItems="center" gap={1}>
            <ClampedTextContainer variant="body2" sx={{ maxWidth: "5.4rem" }}>
                {city}
            </ClampedTextContainer>
            <Box
                onClick={handleDeleteLocation}
                sx={[
                    (theme) => ({
                        "& svg": {
                            "&:hover": { color: theme.palette.grey[800] },
                            color: theme.palette.grey[600],
                            transition: theme.transitions.create(["color"]),
                        },
                    }),
                ]}
            >
                <ClearIcon fontSize="small" />
            </Box>
        </Stack>
    );
};

export default TabLabel;
