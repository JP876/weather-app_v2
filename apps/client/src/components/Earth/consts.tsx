import { Vector3 } from "three";

export const ATMOSPHERE_DAY_COLOR = "#00aaff";
export const ATMOSPHERE_TWILIGHT_COLOR = "#ff6600";
export const EARTH_RADIUS = 1.8;

// x -> center (lat 0, lon 0)
// y -> north pole (lat 90, lon 0)
// z -> west (lat 0, lon 90)
export const SUN_DIRECTION = new Vector3(Math.random(), Math.random(), Math.random());
