import { useEffect, useRef } from "react";

import Skycons from "./skycons-js/skycons";
import type { SkyconProps, SkyconIconType } from "../../types/weatherIcon";

type WeatherIconProps = Partial<SkyconProps> & { code: string };

const WeatherIcon = ({ icon, code, size, color, animate = true }: WeatherIconProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const ICON = (() => {
            if (icon) return icon;

            if (code.includes("50")) {
                return "FOG";
            } else if (code.includes("13")) {
                return code.includes("d") ? "SNOW_SHOWERS_DAY" : "SNOW_SHOWERS_NIGHT";
            } else if (code.includes("11")) {
                return "THUNDER";
            } else if (code.includes("10")) {
                return "RAIN";
            } else if (code.includes("09")) {
                return code.includes("d") ? "SHOWERS_DAY" : "SHOWERS_NIGHT";
            } else if (code.includes("04") || code.includes("03")) {
                return "CLOUDY";
            } else if (code.includes("02")) {
                return code.includes("d") ? "PARTLY_CLOUDY_DAY" : "PARTLY_CLOUDY_NIGHT";
            } else {
                return code.includes("d") ? "CLEAR_DAY" : "CLEAR_NIGHT";
            }
        })() as SkyconIconType;

        const skycons = new Skycons({ color, resizeClear: true });
        skycons.add(canvasRef.current, ICON);

        if (animate) skycons.play();

        return () => {
            skycons.pause();
            skycons.remove();
        };
    }, [code, color, animate, icon]);

    return <canvas ref={canvasRef} height={size} width={size}></canvas>;
};

export default WeatherIcon;
