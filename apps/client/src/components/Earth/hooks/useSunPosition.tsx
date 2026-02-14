import { useCallback } from "react";
import { getPosition } from "suncalc";
import { Vector3 } from "three";

const useSunPosition = () => {
    return useCallback(
        ({ lat, lng, radius = 1 }: { lat: number; lng: number; radius?: number }) => {
            const { altitude, azimuth } = getPosition(new Date(), lat, lng);
            // altitude -> sun altitude above the horizon in radians, e.g. 0 at the
            //              horizon and PI/2 at the zenith (straight over your head)
            // azimuth -> sun azimuth in radians (direction along the horizon, measured
            //          from south to west), e.g. 0 is south and Math.PI * 3/4 is northwest

            const cosAlt = Math.cos(altitude);
            const sinAlt = Math.sin(altitude);
            const sinAzi = Math.sin(azimuth);
            const cosAzi = Math.cos(azimuth);

            return new Vector3(
                radius * cosAlt * cosAzi, // x
                radius * sinAlt, // y
                radius * cosAlt * sinAzi, // z
            );
        },
        [],
    );
};

export default useSunPosition;
