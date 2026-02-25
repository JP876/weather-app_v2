import { flushSync } from "react-dom";
import { ThemeProvider } from "@mui/material";
import { Router, type AroundNavHandler } from "wouter";
import { Provider } from "jotai";

import { theme } from "./theme";

const aroundNav: AroundNavHandler = (navigate, to, options) => {
    // Check if View Transitions API is supported
    if (!document.startViewTransition || !options?.transition) {
        navigate(to, options);
        return;
    }

    document.startViewTransition(() => {
        flushSync(() => {
            navigate(to, options);
        });
    });
};

const Providers = ({ children }: { children: React.ReactNode }) => {
    return (
        <Provider>
            <Router aroundNav={aroundNav}>
                <ThemeProvider theme={theme}>{children}</ThemeProvider>
            </Router>
        </Provider>
    );
};

export default Providers;
