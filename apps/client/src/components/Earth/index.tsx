import { memo, useLayoutEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useTexture } from "@react-three/drei";
import * as THREE from "three";

import fragmentShader from "./shaders/earth/fragment.glsl";
import vertexShader from "./shaders/earth/vertex.glsl";
import atmosphereFragmentShader from "./shaders/atmosphere/fragment.glsl";
import atmosphereVertexShader from "./shaders/atmosphere/vertex.glsl";
import useSunPosition from "./hooks/useSunPosition";
import useCoordinates from "./hooks/useCoordinates";
import type { CityType } from "../../types";
import {
    ATMOSPHERE_DAY_COLOR,
    ATMOSPHERE_TWILIGHT_COLOR,
    EARTH_RADIUS,
    SUN_DIRECTION,
} from "./consts";
import CitiesMain from "./Cities";

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

    useFrame(() => {
        if (cityRef.current && earthMeshRef.current && atmosphereMeshRef.current) {
            const position = updateSunPosition({
                lat: +cityRef.current.lat,
                lng: +cityRef.current.lng,
            });

            earthMeshRef.current.material.uniforms.uSunDirection.value = position;
            atmosphereMeshRef.current.material.uniforms.uSunDirection.value = position;
        }
    });

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

const Experince = () => {
    return (
        <>
            <EarthModel />
            <CitiesMain />
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
            <OrbitControls enablePan={false} maxDistance={4.8} minDistance={2.2} />
        </Canvas>
    );
};

export default memo(EarthMain);
