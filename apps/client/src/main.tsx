import { createRoot } from "react-dom/client";

import App from "./App.tsx";
import Providers from "./Providers.tsx";

import "./index.css";
import "@fontsource/roboto-mono/300.css";
import "@fontsource/roboto-mono/400.css";
import "@fontsource/roboto-mono/500.css";
import "@fontsource/roboto-mono/700.css";

createRoot(document.getElementById("root")!).render(
    <Providers>
        <App />
    </Providers>,
);
