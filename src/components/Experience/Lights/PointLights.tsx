import { useRef } from "react";
import { useControls } from "leva";
import * as THREE from "three";
import { useHelper } from "@react-three/drei";

const PointLights = () => {
  const ref = useRef<THREE.PointLight>(null!) as React.MutableRefObject<THREE.PointLight>;
  const dev = process.env.NODE_ENV === "development";

  const init = {
    color: "#dbc2c2",
    distance: 3.0,
    decay: 1.5,
    intensity: 3.5,
    position: [0.53, 1.86, 0.76] as [number, number, number],
    helper: false,
  };

  const schema = dev ? init : {};

  const controls: any = useControls("Point Light A", schema, { collapsed: true });

  const color = dev ? controls.color : init.color;
  const distance = dev ? controls.distance : init.distance;
  const decay = dev ? controls.decay : init.decay;
  const intensity = dev ? controls.intensity : init.intensity;
  const position = dev ? controls.position : init.position;
  const helper = dev ? controls.helper : init.helper;
  useHelper(helper ? ref : null, THREE.PointLightHelper, 0.5, "red");

  return <pointLight ref={ref} position={position} color={color} distance={distance} decay={decay} intensity={intensity} />;
};

export default PointLights;
