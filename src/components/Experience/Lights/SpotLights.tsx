import { useRef } from "react";
import { useControls } from "leva";
import * as THREE from "three";
import { SpotLight, useHelper } from "@react-three/drei";

const SpotLights = () => {
  const ref = useRef<THREE.SpotLight>(null!) as React.MutableRefObject<THREE.SpotLight>;
  const dev = process.env.NODE_ENV === "development";

  const init = {
    color: "#d8d7b6",
    distance: 10.3,
    attenuation: 1.5,
    angle: 0.68,
    anglePower: 3.3,
    position: { value: [3, 3, 0] },
    helper: { value: false },
  };

  const schema = dev ? init : {};

  const controls: any = useControls("Spot Light B", schema, { collapsed: true });

  const color = dev ? controls.color : init.color;
  const distance = dev ? controls.distance : init.distance;
  const attenuation = dev ? controls.attenuation : init.attenuation;
  const angle = dev ? controls.angle : init.angle;
  const anglePower = dev ? controls.anglePower : init.anglePower;
  const position = dev ? (controls.position as [number, number, number]) : init.position;
  const helper = dev ? controls.helper : init.helper;

  useHelper(helper ? ref : null, THREE.SpotLightHelper, "red");

  return <SpotLight ref={ref} position={position as [number, number, number]} color={color} distance={distance} angle={angle} attenuation={attenuation} anglePower={anglePower} />;
};

export default SpotLights;
