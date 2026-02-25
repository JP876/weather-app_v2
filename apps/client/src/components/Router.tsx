import { lazy, Suspense } from "react";
import { Route, Switch } from "wouter";

import LoadingRoute from "./ui/Feedback/LoadingRoute";

const AddCityRoute = lazy(() => import("./WeatherForecast/AddCity"));
const CityForecastRoute = lazy(() => import("./WeatherForecast/CityForecast"));

const RouterMain = () => {
    return (
        <Suspense fallback={<LoadingRoute />}>
            <Switch>
                <Route path="/" component={AddCityRoute} />
                <Route path="/:id">{(params) => <CityForecastRoute key={params.id} />}</Route>
            </Switch>
        </Suspense>
    );
};

export default RouterMain;
