import { Canvas } from "@react-three/fiber";
import { Vorshim } from "../../components/Characters/Vorshim";
import { Suspense } from "react";
import { OrbitControls } from "@react-three/drei";

//LIGHTS
import PointLights from "./Lights/PointLights";
import SpotLights from "./Lights/SpotLights";
import DirectLights from "./Lights/DirectLights";

const Experience = () => {
  return (
    <>
      <div style={{ position: "relative", width: "100vw", height: "100vh" }}>
        <Canvas shadows camera={{ position: [1, 0, -1] }}>
          <Suspense>
            <ambientLight intensity={0.5} />
            <PointLights />
            {/* <SpotLights /> */}
            <DirectLights />
            <OrbitControls enablePan={false} enableZoom={false} enableRotate={true} maxPolarAngle={Math.PI / 2} minAzimuthAngle={-Math.PI / 2} maxAzimuthAngle={Math.PI / 2} minDistance={2.5} maxDistance={10} />
            {/* Box */}
            {/* <mesh position={[2, -0.5, 2]} rotation-x={-Math.PI / 2} castShadow>
              <boxGeometry />
              <meshStandardMaterial color="white" />
            </mesh> */}
            {/* Character */}
            <Vorshim animation="Walk" scale={0.85} position-y={-0.8} castShadow />
            {/* Floor */}
            {/* <mesh rotation-x={-Math.PI / 2} position-y={-1} receiveShadow>
            <planeGeometry args={[10, 10]} />
            <meshStandardMaterial color="white" transparent opacity={0} />
          </mesh> */}
          </Suspense>
        </Canvas>
      </div>
    </>
  );
};

export default Experience;
