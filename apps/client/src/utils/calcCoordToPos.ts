import { Vector3 } from "three";

import { EARTH_RADIUS } from "../components/Earth/consts";

type calcCoordToPosOptions = { lat: number; lng: number; radius?: number };

const calcCoordToPos = ({ lat, lng, radius = EARTH_RADIUS }: calcCoordToPosOptions) => {
    const latRad = lat * (Math.PI / 180);
    const lonRad = -lng * (Math.PI / 180);

    return new Vector3(
        Math.cos(latRad) * Math.cos(lonRad) * radius,
        Math.sin(latRad) * radius,
        Math.cos(latRad) * Math.sin(lonRad) * radius,
    );
};

export default calcCoordToPos;
