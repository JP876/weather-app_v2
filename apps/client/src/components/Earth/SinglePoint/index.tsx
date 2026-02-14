import { useEffect, useRef } from "react";
import type { ThreeElements } from "@react-three/fiber";
import * as THREE from "three";

import { EARTH_RADIUS } from "../consts";

const singlePointMat = new THREE.MeshBasicMaterial({ color: "red" });
const singlePointGeo = new THREE.OctahedronGeometry(0.006, 1);

const SinglePoint = ({
    lat,
    lon,
    ...rest
}: { lat: number; lon: number } & ThreeElements["mesh"]) => {
    const meshRef = useRef<THREE.Mesh | null>(null);

    useEffect(() => {
        if (meshRef.current) {
            const latRad = lat * (Math.PI / 180);
            const lonRad = -lon * (Math.PI / 180);

            meshRef.current.position.set(
                Math.cos(latRad) * Math.cos(lonRad) * EARTH_RADIUS,
                Math.sin(latRad) * EARTH_RADIUS,
                Math.cos(latRad) * Math.sin(lonRad) * EARTH_RADIUS,
            );
            meshRef.current.rotation.set(0.0, -lonRad, latRad - Math.PI * 0.5);
        }
    }, [lat, lon]);

    return <mesh material={singlePointMat} geometry={singlePointGeo} {...rest} ref={meshRef} />;
};

export default SinglePoint;
