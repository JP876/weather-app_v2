import { memo, useLayoutEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useTexture } from "@react-three/drei";
import * as THREE from "three";

import fragmentShader from "./shaders/earth/fragment.glsl";
import vertexShader from "./shaders/earth/vertex.glsl";
import atmosphereFragmentShader from "./shaders/atmosphere/fragment.glsl";
import atmosphereVertexShader from "./shaders/atmosphere/vertex.glsl";
import type { CityType } from "../../types";
import useCoordinates from "./hooks/useCoordinates";
import useSunPosition from "./hooks/useSunPosition";

const ATMOSPHERE_DAY_COLOR = "#00aaff";
const ATMOSPHERE_TWILIGHT_COLOR = "#ff6600";
const SUN_DIRECTION = new THREE.Vector3(Math.random() / 2, Math.random() / 2, Math.random());
const EARTH_RADIUS = 1.8;

type EarthMeshType = THREE.Mesh<THREE.SphereGeometry, THREE.ShaderMaterial>;

const EarthModel = () => {
    const earthMeshRef = useRef<EarthMeshType | null>(null);
    const atmosphereMeshRef = useRef<EarthMeshType | null>(null);

    const cityRef = useRef<CityType | null>(null);

    const earthDayTexture = useTexture("./earth/day.jpg", (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.anisotropy = 8;
    });
    const earthNightTexture = useTexture("./earth/night.jpg", (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.anisotropy = 8;
    });
    const earthSpecularCloudsTexture = useTexture("./earth/specularClouds.jpg", (texture) => {
        texture.colorSpace = THREE.LinearSRGBColorSpace;
        texture.anisotropy = 8;
    });
    const boundariesTexture = useTexture("./earth/boundaries.png", (texture) => {
        texture.colorSpace = THREE.LinearSRGBColorSpace;
        texture.anisotropy = 8;
    });

    const updateSunPosition = useSunPosition();
    const getCoordinates = useCoordinates();

    useLayoutEffect(() => {
        getCoordinates().then((city) => {
            if (city) cityRef.current = city;
        });
    }, [getCoordinates]);

    useLayoutEffect(() => {
        const controller = new AbortController();

        const update = () => {
            if (cityRef.current) {
                const position = updateSunPosition({
                    lat: +cityRef.current.lat,
                    lng: +cityRef.current.lng,
                });
                if (earthMeshRef.current && atmosphereMeshRef.current) {
                    earthMeshRef.current.material.uniforms.uSunDirection.value = position;
                    atmosphereMeshRef.current.material.uniforms.uSunDirection.value = position;
                }
            }
        };

        document.addEventListener("second-passed", update, { signal: controller.signal });
        return () => {
            controller.abort();
        };
    }, [updateSunPosition]);

    return (
        <group>
            <mesh ref={earthMeshRef}>
                <sphereGeometry args={[EARTH_RADIUS, 64, 64]} />
                <shaderMaterial
                    vertexShader={vertexShader}
                    fragmentShader={fragmentShader}
                    uniforms={{
                        uDayTexture: new THREE.Uniform(earthDayTexture),
                        uNightTexture: new THREE.Uniform(earthNightTexture),
                        uSpecularCloudsTexture: new THREE.Uniform(earthSpecularCloudsTexture),
                        uBoundariesTexture: new THREE.Uniform(boundariesTexture),
                        uSunDirection: new THREE.Uniform(SUN_DIRECTION),
                        uAtmosphereDayColor: new THREE.Uniform(
                            new THREE.Color(ATMOSPHERE_DAY_COLOR),
                        ),
                        uAtmosphereTwilightColor: new THREE.Uniform(
                            new THREE.Color(ATMOSPHERE_TWILIGHT_COLOR),
                        ),
                    }}
                />
            </mesh>
            <mesh ref={atmosphereMeshRef}>
                <sphereGeometry args={[EARTH_RADIUS * 1.04, 64, 64]} />
                <shaderMaterial
                    side={THREE.BackSide}
                    transparent
                    vertexShader={atmosphereVertexShader}
                    fragmentShader={atmosphereFragmentShader}
                    uniforms={{
                        uSunDirection: new THREE.Uniform(SUN_DIRECTION),
                        uAtmosphereDayColor: new THREE.Uniform(
                            new THREE.Color(ATMOSPHERE_DAY_COLOR),
                        ),
                        uAtmosphereTwilightColor: new THREE.Uniform(
                            new THREE.Color(ATMOSPHERE_TWILIGHT_COLOR),
                        ),
                    }}
                />
            </mesh>
        </group>
    );
};

/* const CityMarkers = () => {
    const meshRef = useRef<THREE.Mesh | null>(null);

    useEffect(() => {
        if (meshRef.current) {
            const lat = 51.51;
            const lon = -0.13;

            const latRad = lat * (Math.PI / 180);
            const lonRad = -lon * (Math.PI / 180);

            meshRef.current.position.set(
                Math.cos(latRad) * Math.cos(lonRad) * EARTH_RADIUS,
                Math.sin(latRad) * EARTH_RADIUS,
                Math.cos(latRad) * Math.sin(lonRad) * EARTH_RADIUS,
            );
            meshRef.current.rotation.set(0.0, -lonRad, latRad - Math.PI * 0.5);
        }
    }, []);

    return (
        <mesh ref={meshRef}>
            <octahedronGeometry args={[0.004, 1]} />
            <pointsMaterial color="red" />
        </mesh>
    );
}; */

const Experince = () => {
    return (
        <>
            <EarthModel />
            {/* <CityMarkers /> */}
        </>
    );
};

const EarthMain = () => {
    return (
        <Canvas
            onCreated={({ gl }) => {
                gl.toneMapping = THREE.NoToneMapping;
                gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
                gl.setClearColor("#000011");
            }}
        >
            <Experince />
            <OrbitControls enablePan={false} maxDistance={4} minDistance={2.2} />
        </Canvas>
    );
};

export default memo(EarthMain);
