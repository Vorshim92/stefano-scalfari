import { useRef } from "react";
import { useControls } from "leva";
import * as THREE from "three";
import { useHelper } from "@react-three/drei";

const DirectLights = () => {
  const ref = useRef<THREE.DirectionalLight>(null!) as React.MutableRefObject<THREE.DirectionalLight>;
  const dev = process.env.NODE_ENV === "development";

  const init = {
    color: "#ffffff",
    intensity: 8.5,
    position: { value: [-11.5, 10, 0] },
    helper: { value: false },
  };

  const schema = dev ? init : {};

  const controls: any = useControls("Directional Light C", schema, { collapsed: true });

  const color = dev ? controls.color : init.color;
  const intensity = dev ? controls.intensity : init.intensity;
  const position = dev ? (controls.position as [number, number, number]) : init.position;
  const helper = dev ? controls.helper : init.helper;
  useHelper(helper ? ref : null, THREE.DirectionalLightHelper, 0.5, "red");

  return (
    <directionalLight ref={ref} castShadow intensity={intensity} position={position as [number, number, number]} color={color}>
      <orthographicCamera attach="shadow-camera" args={[-5, 5, 5, -5, 1, 15]} />
    </directionalLight>
  );
};

export default DirectLights;
