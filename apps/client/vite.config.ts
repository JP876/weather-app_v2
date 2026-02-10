import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import glsl from "vite-plugin-glsl";

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), glsl()],
    server: {
        proxy: {
            "/api/v1": {
                target: "http://localhost:5000",
                changeOrigin: true,
            },
        },
    },
});
