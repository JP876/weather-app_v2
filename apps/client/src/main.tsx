import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "jotai";

import App from "./App.tsx";

import "./index.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <Provider>
            <App />
        </Provider>
    </StrictMode>,
);
