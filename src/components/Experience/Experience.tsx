import { Canvas } from "@react-three/fiber";
import { Vorshim } from "../../components/Characters/Vorshim";
import { OrbitControls } from "@react-three/drei";
import { useEffect, useState, Suspense } from "react";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { setSteps } from "../../app/actions/stepCounterActions";
import io from "socket.io-client";

import { ReactComponent as MatrixGitHubIcon } from "../../assets/matrix-github-icon.svg";
import { ReactComponent as MatrixLinkedInIcon } from "../../assets/matrix-linkedin-icon.svg";

//LIGHTS
import PointLights from "./Lights/PointLights";
import SpotLights from "./Lights/SpotLights";
import DirectLights from "./Lights/DirectLights";
const dev = process.env.NODE_ENV === "development";

// OVERLAY TEXT COMPONENTS
const OverlayText = ({ steps, views }: { steps: number; views: number }) => {
  return (
    <>
      {/* OVERLAY TOP */}
      <div style={{ position: "absolute", top: "10%", width: "100%", textAlign: "center", color: "#0f0", zIndex: 10 }}>
        <h1 className="responsive-heading">STEFANO SCALFARI</h1>
        <h2 className="responsive-subheading">INITIALIZING MATRIX...</h2>
      </div>

      {/* OVERLAY BOTTOM */}
      <div
        style={{
          position: "absolute",
          bottom: "0%",
          width: "100%",
          textAlign: "center",
          color: "#0f0",
          fontFamily: "Roboto Mono, monospace",
          fontSize: "1.2rem",
          textShadow: "0 0 5px #0f0",
          zIndex: 10,
        }}
      >
        <h3>
          STEPS TAKEN: <span style={{ color: "#fff" }}>{steps}</span>
        </h3>
        <h3>
          VIEWS: <span style={{ color: "#fff" }}>{views}</span>
        </h3>
        <div style={{ display: "inline-flex", gap: "1rem" }}>
          <a
            href="https://github.com/Vorshim92"
            target="_blank"
            rel="noopener noreferrer"
            className="icon-container" // Applica la classe qui
          >
            <div style={{ filter: "drop-shadow(0 0 5px #0f0)" }}>
              <MatrixGitHubIcon />
            </div>
          </a>
          <a
            href="https://www.linkedin.com/in/stefano-scalfari"
            target="_blank"
            rel="noopener noreferrer"
            className="icon-container" // Applica la classe anche qui
          >
            <div style={{ filter: "drop-shadow(0 0 5px #0f0)" }}>
              <MatrixLinkedInIcon />
            </div>
          </a>
        </div>
      </div>
    </>
  );
};

const Experience = () => {
  const dispatch = useAppDispatch();
  const steps = useAppSelector((state) => state.stepCounter.steps); // example store with Redux
  const [views, setViews] = useState(0); // example store with State

  useEffect(() => {
    // Connessione al server WebSocket tramite il reverse proxy
    const socket = io(dev ? "http://localhost:3001" : "/", {
      path: "/socket.io/",
      secure: !dev,
      transports: ["websocket", "polling"], // Trasporto di fallback
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
      <div style={{ position: "relative", width: "100vw", height: "100vh" }}>
        <Canvas shadows camera={{ position: [0.1, 0.1, 0.1] }}>
          {/* <Suspense fallback={null}> */}
          <ambientLight intensity={0.5} />
          <PointLights />
          {/* <SpotLights /> */}
          <DirectLights />
          <OrbitControls enablePan={false} enableZoom={false} enableRotate={true} maxPolarAngle={Math.PI / 2} minAzimuthAngle={-Math.PI / 2} maxAzimuthAngle={Math.PI / 2} minDistance={3} maxDistance={10} />
          {/* Box */}
          {/* <mesh position={[2, -0.5, 2]} rotation-x={-Math.PI / 2} castShadow>
              <boxGeometry />
              <meshStandardMaterial color="white" />
            </mesh> */}
          {/* Character */}
          <Vorshim animation="Walk" scale={0.85} position-y={-0.8} castShadow />
          {/* Floor */}
          <mesh rotation-x={-Math.PI / 2} position-y={-1} receiveShadow>
            <planeGeometry args={[10, 10]} />
            <meshStandardMaterial color="white" transparent opacity={0} />
          </mesh>
          {/* </Suspense> */}
        </Canvas>
      </div>
      {/* Overlay Testo */}
      <OverlayText steps={steps} views={views} />
    </>
  );
};

export default Experience;
