import { useCallback } from "react";
import { getPosition } from "suncalc";
import { Vector3 } from "three";

const useSunPosition = () => {
    return useCallback(({ lat, lng }: { lat: number; lng: number }) => {
        const position = getPosition(new Date(), lat, lng);

        const azimuth = position.azimuth + Math.PI / 1.8;
        const altitude = position.altitude + Math.PI / 1.92;

        const x = Math.cos(altitude) * Math.sin(azimuth);
        const y = Math.cos(altitude) * Math.cos(azimuth);
        const z = Math.sin(altitude);

        return new Vector3(x, y, z);
    }, []);
};

export default useSunPosition;
