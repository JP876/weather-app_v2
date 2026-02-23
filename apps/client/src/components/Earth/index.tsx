import { lazy, memo, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { NoToneMapping } from "three";

const CitiesMain = lazy(() => import("./Cities"));
const EarthModelMain = lazy(() => import("./EarthModel"));

const Experince = () => {
    return (
        <Suspense fallback={null}>
            <EarthModelMain />
            <CitiesMain />
        </Suspense>
    );
};

const EarthMain = () => {
    return (
        <Canvas
            onCreated={({ gl }) => {
                gl.toneMapping = NoToneMapping;
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
