import { createRoot } from "react-dom/client";
import { ThemeProvider } from "@mui/material";
import { Provider } from "jotai";
import { Router } from "wouter";

import App from "./App.tsx";
import { theme } from "./theme/index.ts";

import "./index.css";
import "@fontsource/roboto-mono/300.css";
import "@fontsource/roboto-mono/400.css";
import "@fontsource/roboto-mono/500.css";
import "@fontsource/roboto-mono/700.css";

createRoot(document.getElementById("root")!).render(
    <Provider>
        <Router>
            <ThemeProvider theme={theme}>
                <App />
            </ThemeProvider>
        </Router>
    </Provider>,
);
