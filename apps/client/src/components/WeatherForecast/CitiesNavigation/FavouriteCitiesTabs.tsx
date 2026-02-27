import { atom, useAtomValue } from "jotai";
import { TransitionGroup } from "react-transition-group";
import { useLocation } from "wouter";
import { Slide, Tab } from "@mui/material";

import { favouriteCitiesAtom, weatherFetchInfoAtom } from "../../../atoms";
import TabLabel from "./TabLabel";

const isLoadingWeatherAtom = atom((get) => get(weatherFetchInfoAtom).isLoading);

const a11yProps = (index: number | string) => {
    return {
        id: `tab-${index}`,
        "aria-controls": `tabpanel-${index}`,
    };
};

type LinkTabProps = {
    label?: string;
    selected?: string;
};

const FavouriteCitiesTabs = (props: LinkTabProps) => {
    const isLoadingWeather = useAtomValue(isLoadingWeatherAtom);
    const favouriteCities = useAtomValue(favouriteCitiesAtom);

    const [path] = useLocation();
    const cId = path.split("/")?.[1];

    const cities = (favouriteCities || []).map((el) => {
        const selected = el?.id.toString() === cId;
        return { tabProps: { ...props, ...a11yProps(el?.id), selected }, ...el };
    });

    return (
        <TransitionGroup>
            {(cities || []).map((el, index) => (
                <Slide key={el.id}>
                    <Tab
                        disableRipple
                        sx={{ alignItems: "center", p: 1 }}
                        {...el.tabProps}
                        value={`/${el.id}`}
                        disabled={isLoadingWeather === "INITIAL"}
                        label={
                            <TabLabel
                                id={el.id}
                                city={el.city}
                                index={index}
                                prevCityId={favouriteCities?.[index - 1]?.id || null}
                            />
                        }
                    />
                </Slide>
            ))}
        </TransitionGroup>
    );
};

export default FavouriteCitiesTabs;
