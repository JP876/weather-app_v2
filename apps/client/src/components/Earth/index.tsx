import { useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

const EarthMain = () => {
    const meshRef = useRef<THREE.Mesh | null>(null);

    return (
        <Canvas gl={{ toneMapping: THREE.NoToneMapping }}>
            <group>
                <mesh ref={meshRef}>
                    <sphereGeometry args={[1.6, 64, 64]} />
                    <meshStandardMaterial color={"blue"} />
                </mesh>
            </group>
            <hemisphereLight args={[0xffffff, 0x000000, 3]} />
            <OrbitControls enablePan={false} maxDistance={4} minDistance={2} />
        </Canvas>
    );
};

export default EarthMain;
