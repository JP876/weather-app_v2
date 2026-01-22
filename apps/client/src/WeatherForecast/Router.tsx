import { flushSync } from "react-dom";
import { Route, Router, type AroundNavHandler } from "wouter";

import AddCityMain from "./AddCity";
import CityForecastMain from "./CityForecast";

const aroundNav: AroundNavHandler = (navigate, to, options) => {
    // Check if View Transitions API is supported
    if (!document.startViewTransition) {
        navigate(to, options);
        return;
    }

    document.startViewTransition(() => {
        flushSync(() => {
            navigate(to, options);
        });
    });
};

const RouterMain = () => {
    return (
        <Router aroundNav={aroundNav}>
            <Route path="/" component={AddCityMain} />
            <Route path="/:id" component={CityForecastMain} />
        </Router>
    );
};

export default RouterMain;
