import { memo, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useTexture } from "@react-three/drei";
import * as THREE from "three";

import fragmentShader from "./shaders/earth/fragment.glsl";
import vertexShader from "./shaders/earth/vertex.glsl";
import atmosphereFragmentShader from "./shaders/atmosphere/fragment.glsl";
import atmosphereVertexShader from "./shaders/atmosphere/vertex.glsl";

const ATMOSPHERE_DAY_COLOR = "#00aaff";
const ATMOSPHERE_TWILIGHT_COLOR = "#ff6600";
const SUN_DIRECTION = new THREE.Vector3(0, 1, 0);
const EARTH_RADIUS = 1.8;

const EarthModel = () => {
    const shaderRef = useRef<THREE.ShaderMaterial | null>(null);

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

    return (
        <mesh>
            <sphereGeometry args={[EARTH_RADIUS, 64, 64]} />
            <shaderMaterial
                ref={shaderRef}
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                uniforms={{
                    uDayTexture: new THREE.Uniform(earthDayTexture),
                    uNightTexture: new THREE.Uniform(earthNightTexture),
                    uSpecularCloudsTexture: new THREE.Uniform(earthSpecularCloudsTexture),
                    uSunDirection: new THREE.Uniform(new THREE.Vector3(0, 1, 0)),
                    uAtmosphereDayColor: new THREE.Uniform(new THREE.Color(ATMOSPHERE_DAY_COLOR)),
                    uAtmosphereTwilightColor: new THREE.Uniform(
                        new THREE.Color(ATMOSPHERE_TWILIGHT_COLOR),
                    ),
                }}
            />
        </mesh>
    );
};

const Atmosphere = () => {
    const shaderRef = useRef<THREE.ShaderMaterial | null>(null);

    return (
        <mesh>
            <sphereGeometry args={[EARTH_RADIUS * 1.04, 64, 64]} />
            <shaderMaterial
                ref={shaderRef}
                side={THREE.BackSide}
                transparent
                vertexShader={atmosphereVertexShader}
                fragmentShader={atmosphereFragmentShader}
                uniforms={{
                    uSunDirection: new THREE.Uniform(SUN_DIRECTION),
                    uAtmosphereDayColor: new THREE.Uniform(new THREE.Color(ATMOSPHERE_DAY_COLOR)),
                    uAtmosphereTwilightColor: new THREE.Uniform(
                        new THREE.Color(ATMOSPHERE_TWILIGHT_COLOR),
                    ),
                }}
            />
        </mesh>
    );
};

const Experince = () => {
    return (
        <>
            <EarthModel />
            <Atmosphere />
        </>
    );
};

const EarthMain = () => {
    return (
        <Canvas
            onCreated={({ gl }) => {
                gl.toneMapping = THREE.NoToneMapping;
                gl.setPixelRatio(window.devicePixelRatio);
                gl.setClearColor("#000011");
            }}
        >
            <Experince />
            <OrbitControls enablePan={false} maxDistance={4} minDistance={2.8} />
        </Canvas>
    );
};

export default memo(EarthMain);
