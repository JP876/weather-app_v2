import { useLayoutEffect, useRef } from "react";
import type { Mesh, ShaderMaterial, SphereGeometry } from "three";
import { BackSide, Color, LinearSRGBColorSpace, SRGBColorSpace, Uniform } from "three";
import { useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

import type { CityType } from "../../../types";
import useSunPosition from "../hooks/useSunPosition";
import useCoordinates from "../hooks/useCoordinates";
import {
    ATMOSPHERE_DAY_COLOR,
    ATMOSPHERE_TWILIGHT_COLOR,
    EARTH_RADIUS,
    SUN_DIRECTION,
} from "../consts";

import atmosphereFragmentShader from "../shaders/atmosphere/fragment.glsl";
import atmosphereVertexShader from "../shaders/atmosphere/vertex.glsl";
import fragmentShader from "../shaders/earth/fragment.glsl";
import vertexShader from "../shaders/earth/vertex.glsl";

type EarthMeshType = Mesh<SphereGeometry, ShaderMaterial>;

const EarthModelMain = () => {
    const earthMeshRef = useRef<EarthMeshType | null>(null);
    const atmosphereMeshRef = useRef<EarthMeshType | null>(null);

    const cityRef = useRef<CityType | null>(null);

    const earthDayTexture = useTexture("./earth/day.jpg", (texture) => {
        texture.colorSpace = SRGBColorSpace;
        texture.anisotropy = 8;
    });
    const earthNightTexture = useTexture("./earth/night.jpg", (texture) => {
        texture.colorSpace = SRGBColorSpace;
        texture.anisotropy = 8;
    });
    const earthSpecularCloudsTexture = useTexture("./earth/specularClouds.webp", (texture) => {
        texture.colorSpace = LinearSRGBColorSpace;
        texture.anisotropy = 8;
    });
    const boundariesTexture = useTexture("./earth/boundaries.png", (texture) => {
        texture.colorSpace = LinearSRGBColorSpace;
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
                        uDayTexture: new Uniform(earthDayTexture),
                        uNightTexture: new Uniform(earthNightTexture),
                        uSpecularCloudsTexture: new Uniform(earthSpecularCloudsTexture),
                        uBoundariesTexture: new Uniform(boundariesTexture),
                        uSunDirection: new Uniform(SUN_DIRECTION),
                        uAtmosphereDayColor: new Uniform(new Color(ATMOSPHERE_DAY_COLOR)),
                        uAtmosphereTwilightColor: new Uniform(new Color(ATMOSPHERE_TWILIGHT_COLOR)),
                    }}
                />
            </mesh>
            <mesh ref={atmosphereMeshRef}>
                <sphereGeometry args={[EARTH_RADIUS * 1.04, 64, 64]} />
                <shaderMaterial
                    side={BackSide}
                    transparent
                    vertexShader={atmosphereVertexShader}
                    fragmentShader={atmosphereFragmentShader}
                    uniforms={{
                        uSunDirection: new Uniform(SUN_DIRECTION),
                        uAtmosphereDayColor: new Uniform(new Color(ATMOSPHERE_DAY_COLOR)),
                        uAtmosphereTwilightColor: new Uniform(new Color(ATMOSPHERE_TWILIGHT_COLOR)),
                    }}
                />
            </mesh>
        </group>
    );
};

export default EarthModelMain;
