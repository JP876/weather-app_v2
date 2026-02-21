import { useEffect, useRef } from "react";
import type { ThreeElements } from "@react-three/fiber";
import * as THREE from "three";

import calcCoordToPos from "../../../utils/calcCoordToPos";

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

            const { x, y, z } = calcCoordToPos({ lat, lng: lon });

            meshRef.current.position.set(x, y, z);
            meshRef.current.rotation.set(0.0, -lonRad, latRad - Math.PI * 0.5);
        }
    }, [lat, lon]);

    return <mesh material={singlePointMat} geometry={singlePointGeo} {...rest} ref={meshRef} />;
};

export default SinglePoint;
