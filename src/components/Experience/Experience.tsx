import { Canvas } from "@react-three/fiber";
import { Vorshim } from "../../components/Characters/Vorshim";
import { OrbitControls } from "@react-three/drei";
import { useEffect, useState, Suspense } from "react";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { setSteps } from "../../app/actions/stepCounterActions";
import io from "socket.io-client";

//LIGHTS
import PointLights from "./Lights/PointLights";
import SpotLights from "./Lights/SpotLights";
import DirectLights from "./Lights/DirectLights";

import OverlayText from "./OverlayText";

import MatrixRain from "../../components/MatrixRain/MatrixRain";
import AudioPlayer from "../../components/AudioPlayer/AudioPlayer";

const dev = process.env.NODE_ENV === "development";

const Experience = () => {
  const dispatch = useAppDispatch();
  const [liveUsers, setLiveUsers] = useState(0);
  const steps = useAppSelector((state) => state.stepCounter.steps); // example store with Redux
  const [views, setViews] = useState(0); // example store with State
  useEffect(() => {
    console.log("Experience mounted");

    return () => {
      console.log("Experience unmounted");
    };
  }, []);
  useEffect(() => {
    // Connessione al server WebSocket tramite il reverse proxy
    const socket = io(dev ? "http://localhost:3001" : "/", {
      path: "/socket.io/",
      secure: !dev,
      transports: ["websocket", "polling"], // Trasporto di fallback
    });

    // Ascolta gli utenti connessi
    socket.on("usersConnected", (data: { usersConnected: number }) => {
      setLiveUsers(data.usersConnected);
    });

    // Ascolta gli aggiornamenti del contatore dei passi
    socket.on("stepCounterUpdate", (data: { stepCounter: number }) => {
      dispatch(setSteps(data.stepCounter));
    });

    // Ascolta gli aggiornamenti del contatore delle visualizzazioni
    socket.on("viewsCounterUpdate", (data: { viewsCounter: number }) => {
      setViews(data.viewsCounter);
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
    <>
      <MatrixRain />
      {/* Overlay Testo */}
      <OverlayText steps={steps} totalviews={views} viewers={liveUsers} />
      <AudioPlayer />
      <div style={{ position: "relative", width: "100vw", height: "100vh" }}>
        <Canvas shadows camera={{ position: [1, 0, -1] }}>
          {/* <Suspense fallback={null}> */}
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
          {/* </Suspense> */}
        </Canvas>
      </div>
    </>
  );
};

export default Experience;
