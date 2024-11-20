import { Canvas } from "@react-three/fiber";
import { Vorshim } from "./components/Characters/Vorshim";
import { OrbitControls, SpotLight, useHelper } from "@react-three/drei";
import { useEffect, useRef } from "react";
// import { useMemo } from "react";
import { useControls } from "leva";
import * as THREE from "three";
import { useAppSelector, useAppDispatch } from "./app/hooks";
import { setSteps } from "./app/actions/stepCounterActions";
import io from "socket.io-client";
import "./App.css";
const PointLights = () => {
  const ref = useRef<THREE.PointLight>(null!) as React.MutableRefObject<THREE.PointLight>;
  // useHelper(ref, THREE.PointLightHelper, 0.5, "red");

  const lightA = useControls("Point Light A", {
    color: "#dbc2c2",
    distance: 3.0,
    decay: 1.5,
    intensity: 6,
    position: { value: [0.53, 1.86, 0.76] },
  });

  return <pointLight ref={ref} position={lightA.position} color={lightA.color} distance={lightA.distance} decay={lightA.decay} intensity={lightA.intensity} />;
};

const SpotLights = () => {
  const ref = useRef<THREE.SpotLight>(null!) as React.MutableRefObject<THREE.SpotLight>;
  // useHelper(ref, THREE.SpotLightHelper, "red");

  const lightB = useControls("Spot Light B", {
    color: "#d8d7b6",
    distance: 10.3,
    attenuation: 1.5,
    angle: 0.68,
    anglePower: 3.3,
    position: { value: [3, 3, 0] },
  });

  return <SpotLight ref={ref} position={lightB.position} color={lightB.color} distance={lightB.distance} angle={lightB.angle} attenuation={lightB.attenuation} anglePower={lightB.anglePower} />;
};

function App() {
  const dispatch = useAppDispatch();
  const steps = useAppSelector((state) => state.stepCounter.steps);

  useEffect(() => {
    // Connessione al server WebSocket tramite il reverse proxy
    const socket = io("/", {
      path: "/socket.io/",
      secure: true,
      transports: ["websocket", "polling"], // Aggiungi "polling" come trasporto di fallback
    });

    // Ascolta gli aggiornamenti del contatore
    socket.on("counterUpdate", (data: { counter: number }) => {
      dispatch(setSteps(data.counter));
    });

    // Gestisci errori di connessione
    socket.on("connect_error", (error) => {
      console.error("Errore di connessione Socket.IO:", error);
    });

    // Pulisce la connessione al WebSocket quando il componente viene smontato
    return () => {
      socket.disconnect();
    };
  }, [dispatch]);

  return (
    <div className="container vh-100 d-flex justify-content-center align-items-center">
      <div className="row">
        <div className="col-12">
          <div className="text-center">
            <h1 className="" style={{ color: "#fff", textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)" }}>
              STEFANO SCALFARI
            </h1>
            <h2>UNDER CONSTRUCTION</h2>
          </div>
        </div>
        <div className="col-12 mt-5" style={{ height: "50vh" }}>
          <Canvas camera={{ position: [0.1, 0.1, 0.1] }}>
            <ambientLight intensity={1} />
            <PointLights />
            {/* <SpotLights /> */}
            <OrbitControls enablePan={false} enableZoom={false} enableRotate={false} maxPolarAngle={Math.PI / 2} minAzimuthAngle={-Math.PI / 2} maxAzimuthAngle={Math.PI / 2} minDistance={3} maxDistance={10} />
            <Vorshim animation="Walk" scale={1.5} position-y={-1} />
          </Canvas>
        </div>
        <div className="col-12 mt-5">
          <div className="text-center">
            <h1 className="counter">
              PASSI FATTI: <span className="steps-number">{steps}</span>
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
