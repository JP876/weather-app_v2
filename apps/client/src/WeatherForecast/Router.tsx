import { Route } from "wouter";

import AddCityMain from "./AddCity";
import CityForecastMain from "./CityForecast";

const RouterMain = () => {
    return (
        <>
            <Route path="/" component={AddCityMain} />
            <Route path="/:id" component={CityForecastMain} />
        </>
    );
};

export default RouterMain;
