import { memo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useTexture } from "@react-three/drei";
import * as THREE from "three";

import fragmentShader from "./shaders/earth/fragment.glsl";
import vertexShader from "./shaders/earth/vertex.glsl";

const EarthModel = memo(() => {
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

    useFrame((state, delta) => {});

    return (
        <mesh>
            <sphereGeometry args={[1.8, 64, 64]} />
            <shaderMaterial
                ref={shaderRef}
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                uniforms={{
                    uDayTexture: new THREE.Uniform(earthDayTexture),
                    uNightTexture: new THREE.Uniform(earthNightTexture),
                    uSpecularCloudsTexture: new THREE.Uniform(earthSpecularCloudsTexture),
                    uSunDirection: new THREE.Uniform(new THREE.Vector3(0, 0, 1)),
                }}
            />
        </mesh>
    );
});

const EarthMain = () => {
    return (
        <Canvas gl={{ toneMapping: THREE.NoToneMapping, antialias: true }}>
            <EarthModel />
            <OrbitControls enablePan={false} maxDistance={4} minDistance={2.8} />
        </Canvas>
    );
};

export default memo(EarthMain);
