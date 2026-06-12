import { memo } from "react";
import { Box, Stack, styled, type BoxProps, type TypographyProps } from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ClearIcon from "@mui/icons-material/Clear";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import { useAtomValue } from "jotai";

import type { CityType } from "../../../../types";
import ClampedTextContainer from "../../../ui/ClampedTextContainer";
import Clock from "../../../ui/Clock";
import { userSettingsAtom } from "../../../../atoms";
import type { CityItemType } from "../../../../atoms/types";

type CityInfoProps = Pick<
    CityType,
    "iso2" | "country" | "city" | "lat" | "lng" | "timezone" | "capital"
> & {
    isFavourite: boolean;
};

const CityListItemButton = styled(Box)<BoxProps>(({ theme }) => ({
    width: "1.5rem",
    height: "1.5rem",
    position: "relative",

    "& svg": {
        position: "absolute",
        transition: theme.transitions.create(["opacity"]),
    },
}));

const CityInfo = memo((props: CityInfoProps) => {
    const cityInfoSettings = useAtomValue(userSettingsAtom)?.cityItem;

    const getCityInfo = (
        position: keyof CityItemType,
        info: (typeof cityInfoSettings)[keyof CityItemType],
    ) => {
        const typographyProps: Pick<TypographyProps, "variant" | "sx"> = (() => {
            switch (position) {
                case "topLeft":
                    return {
                        variant: "subtitle1",
                        sx: (theme) => ({
                            marginBottom: theme.spacing(-0.5),
                            fontWeight: theme.typography.fontWeightBold,
                            fontSize: theme.typography.h6.fontSize,
                        }),
                    };
                case "bottomLeft":
                    return { variant: "caption" };
                default:
                    return { variant: "body2" };
            }
        })();

        switch (info) {
            case "city":
                return (
                    <ClampedTextContainer {...typographyProps}>{props.city}</ClampedTextContainer>
                );
            case "cityiso2":
                return (
                    <ClampedTextContainer
                        {...typographyProps}
                    >{`${props.city},${props.iso2}`}</ClampedTextContainer>
                );
            case "coordinates":
                return (
                    <Stack direction="row" alignItems="center" gap={1}>
                        <LocationOnIcon />
                        <ClampedTextContainer {...typographyProps}>
                            {`${parseFloat(props.lat.toString()).toFixed(2)} - 
                                    ${parseFloat(props.lng.toString()).toFixed(2)}`}
                        </ClampedTextContainer>
                    </Stack>
                );
            case "country":
                return (
                    <ClampedTextContainer {...typographyProps}>
                        {props.country}
                    </ClampedTextContainer>
                );
            case "countryiso2":
                return (
                    <ClampedTextContainer
                        {...typographyProps}
                    >{`${props.country},${props.iso2}`}</ClampedTextContainer>
                );
            case "localtime":
                if (!props.timezone) return null;
                return (
                    <Stack direction="row" alignItems="center" gap={1}>
                        <AccessTimeIcon />
                        <Clock
                            timezone={props.timezone}
                            format="HH:mm dd/MMM/yy"
                            variant={typographyProps.variant}
                        />
                    </Stack>
                );
            case "hide":
            default:
                return "";
        }
    };

    return (
        <>
            <Stack direction="row" alignItems="center" gap={2}>
                {cityInfoSettings.flag === "show" || !cityInfoSettings.flag ? (
                    <Box
                        component="img"
                        width={32}
                        height={20}
                        src={`https://flagcdn.com/w40/${props.iso2.toLowerCase()}.png`}
                        alt={`${props.country} flag`}
                    />
                ) : null}
                <Stack>
                    <Stack direction="row" gap={1} alignItems="center">
                        {props.capital === "primary" ? (
                            <LocationCityIcon fontSize="small" sx={{ mt: "2.4px" }} />
                        ) : null}
                        {getCityInfo("topLeft", cityInfoSettings.topLeft)}
                    </Stack>
                    {getCityInfo("bottomLeft", cityInfoSettings.bottomLeft)}
                </Stack>
            </Stack>
            <Stack direction="row" alignItems="center" justifyContent="space-between" gap={4}>
                <Box
                    sx={(theme) => ({
                        display: "grid",
                        gridTemplateColumns: "1fr",
                        fontSize: theme.typography.body2.fontSize,
                        gap: theme.spacing(0.4),
                        minWidth: "10rem",

                        [theme.breakpoints.down("md")]: {
                            display: "none",
                        },
                        svg: {
                            width: "1rem",
                            height: "1rem",
                        },
                    })}
                >
                    {getCityInfo("topRight", cityInfoSettings.topRight)}
                    {getCityInfo("bottomRight", cityInfoSettings.bottomRight)}
                </Box>
                <CityListItemButton>
                    <FavoriteBorderIcon sx={{ opacity: +!props.isFavourite }} />
                    <ClearIcon sx={{ opacity: +props.isFavourite }} />
                </CityListItemButton>
            </Stack>
        </>
    );
});

export default CityInfo;
