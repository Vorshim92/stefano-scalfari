import { Canvas } from "@react-three/fiber";
import { Vorshim } from "./components/Characters/Vorshim";
import { Loader, useProgress, OrbitControls, SpotLight, useHelper } from "@react-three/drei";
import { useEffect, useRef, useState, Suspense } from "react";
// import { useMemo } from "react";
import { useControls } from "leva";
import * as THREE from "three";
import { useAppSelector, useAppDispatch } from "./app/hooks";
import { setSteps } from "./app/actions/stepCounterActions";
import io from "socket.io-client";
import "./App.css";

import MatrixRain from "./components/MatrixRain/MatrixRain";

import { ReactComponent as MatrixGitHubIcon } from "./assets/matrix-github-icon.svg";
import { ReactComponent as MatrixLinkedInIcon } from "./assets/matrix-linkedin-icon.svg";

import { Howl } from "howler";
import backgroundMusic from "./assets/background-music.mp3";

function isAudioLocked(): Promise<boolean> {
  return new Promise((resolve) => {
    const checkHTML5Audio = () => {
      const audio = new Audio();
      try {
        audio.play();
        resolve(false);
      } catch (err) {
        resolve(true);
      }
    };
    try {
      const context = new (window.AudioContext || (window as any).webkitAudioContext)();
      resolve(context.state === "suspended");
    } catch (e) {
      checkHTML5Audio();
    }
  });
}

const userGestureEvents = ["click", "contextmenu", "auxclick", "dblclick", "mousedown", "mouseup", "pointerup", "touchend", "keydown", "keyup"];

const AudioPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(true);
  const soundRef = useRef<Howl | null>(null);

  useEffect(() => {
    soundRef.current = new Howl({
      src: [backgroundMusic],
      loop: true,
      volume: 0.0,
      mute: true, // partiamo in muto, così se l'audio è bloccato non generiamo errori
      onload: () => console.log("Audio loaded"),
      onloaderror: (id, err) => console.log("Load error:", err),
      onplay: (id) =>
        function () {
          console.log("onplay triggered");
          setIsPlaying(true);
        },
      onplayerror: (id, error) => {
        console.log("onplayerror triggered:", error);
      },
    });

    const unlockAudio = () => {
      console.log("User gesture detected, unlocking audio!");
      soundRef.current?.mute(false);
      soundRef.current?.play();
      setIsPlaying(true);
      userGestureEvents.forEach((eventName) => {
        document.removeEventListener(eventName, unlockAudio);
      });
    };

    isAudioLocked().then((locked) => {
      if (locked) {
        console.log("Audio is locked by browser policy. Waiting for user gesture...");
        setIsPlaying(false);
        // Registriamo gli event listener. Al primo click/tocco/tasto premuto si sblocca l'audio
        userGestureEvents.forEach((eventName) => {
          document.addEventListener(eventName, unlockAudio);
        });
      } else {
        console.log("Audio not locked, starting immediately");
        soundRef.current?.mute(false);
        soundRef.current?.play();
      }
    });
  }, []);

  const toggleAudio = () => {
    if (!soundRef.current) return;
    if (isPlaying) {
      soundRef.current.pause();
      setIsPlaying(false);
    } else {
      soundRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <>
      <div
        className="icon-container"
        id="playButton"
        style={{
          position: "absolute",
          top: "10px",
          left: "10px",
          zIndex: 999,
          cursor: "pointer",
          filter: "drop-shadow(0 0 5px #0f0)",
          width: "40px",
          height: "40px",
        }}
        onClick={toggleAudio}
      >
        {/* Icona di base (nota musicale) */}
        <div className="default-icon">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="40" height="40" fill="transparent" />

            {/* Nota musicale stilizzata: */}
            {/* Un cerchio come testa della nota */}
            <circle cx="14" cy="26" r="4" stroke="#0f0" strokeWidth="2" fill="none" />

            {/* Stanghetta della nota */}
            <line x1="18" y1="26" x2="18" y2="12" stroke="#0f0" strokeWidth="2" />

            {/* Piccola bandierina (croma) */}
            <path d="M18 12 L25 14" stroke="#0f0" strokeWidth="2" fill="none" />

            {/* Linee stile “glitch” orizzontali semi-trasparenti */}
            <line x1="10" y1="10" x2="30" y2="10" stroke="#0f0" strokeDasharray="2 2" opacity="0.3" />
            <line x1="10" y1="20" x2="30" y2="20" stroke="#0f0" strokeDasharray="4 2" opacity="0.3" />
          </svg>
        </div>

        {/* Icona play/pause (mostrata solo su hover) */}
        <div className="hover-icon">
          {isPlaying ? (
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="0" y="0" width="40" height="40" fill="transparent" />
              <line x1="14" y1="10" x2="14" y2="30" stroke="#0f0" strokeWidth="3" />
              <line x1="26" y1="10" x2="26" y2="30" stroke="#0f0" strokeWidth="3" />
            </svg>
          ) : (
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="0" y="0" width="40" height="40" fill="transparent" />
              <path d="M16 12 L28 20 L16 28 Z" fill="none" stroke="#0f0" strokeWidth="2" />
            </svg>
          )}
        </div>
      </div>
    </>
  );
};

const PointLights = () => {
  const ref = useRef<THREE.PointLight>(null!) as React.MutableRefObject<THREE.PointLight>;
  const dev = process.env.NODE_ENV === "development";

  let helper = false;
  let lightA = { color: "#dbc2c2", distance: 3.0, decay: 1.5, intensity: 3.5, position: [0.53, 1.86, 0.76] };

  useControls("Point Light A", dev ? lightA : {}, { collapsed: true });

  useHelper(helper ? ref : null, THREE.PointLightHelper, 0.5, "red");

  return <pointLight ref={ref} position={lightA.position as [number, number, number]} color={lightA.color} distance={lightA.distance} decay={lightA.decay} intensity={lightA.intensity} />;
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

const DirectLight = () => {
  const ref = useRef<THREE.DirectionalLight>(null!) as React.MutableRefObject<THREE.DirectionalLight>;
  const dev = process.env.NODE_ENV === "development";

  let helper = false;
  let lightC = { color: "#ffffff", intensity: 8.5, position: [-11.5, 10, 0] as [number, number, number] };

  useControls("Directional Light C", dev ? lightC : {}, { collapsed: true });
  useHelper(helper ? ref : null, THREE.DirectionalLightHelper, 0.5, "red");

  return (
    <directionalLight ref={ref} castShadow intensity={lightC.intensity} position={lightC.position} color={lightC.color}>
      <orthographicCamera attach="shadow-camera" args={[-5, 5, 5, -5, 1, 15]} />
    </directionalLight>
  );
};

const Experience = () => {
  const dispatch = useAppDispatch();
  const steps = useAppSelector((state) => state.stepCounter.steps); // example store with Redux
  const [views, setViews] = useState(0); // example store with State

  useEffect(() => {
    // Connessione al server WebSocket tramite il reverse proxy
    const socket = io("/", {
      path: "/socket.io/",
      secure: true,
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
        <Canvas shadows camera={{ position: [0.1, 0.1, 0.1] }} style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}>
          {/* <Suspense fallback={null}> */}
          <ambientLight intensity={0.5} />
          <PointLights />
          {/* <SpotLights /> */}
          <DirectLight />
          <OrbitControls enablePan={false} enableZoom={false} enableRotate={true} maxPolarAngle={Math.PI / 2} minAzimuthAngle={-Math.PI / 2} maxAzimuthAngle={Math.PI / 2} minDistance={3} maxDistance={10} />
          {/* Box */}
          {/* <mesh position={[2, -0.5, 2]} rotation-x={-Math.PI / 2} castShadow>
            <boxGeometry />
            <meshStandardMaterial color="white" />
          </mesh> */}
          {/* Character */}
          <Vorshim animation="Walk" scale={0.85} position-y={-1} castShadow />
          {/* Floor */}
          <mesh rotation-x={-Math.PI / 2} position-y={-1} receiveShadow>
            <planeGeometry args={[10, 10]} />
            <meshStandardMaterial color="white" transparent opacity={0} />
          </mesh>
          {/* </Suspense> */}
        </Canvas>

        {/* Overlay Testo */}
        <div style={{ position: "absolute", top: "20%", width: "100%", textAlign: "center", color: "#0f0", zIndex: 10 }}>
          <h1 className="responsive-heading">STEFANO SCALFARI</h1>
          <h2 className="responsive-subheading">INITIALIZING MATRIX...</h2>
        </div>

        <div
          style={{
            position: "absolute",
            bottom: "10%",
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
      </div>
    </>
  );
};

function App() {
  const { progress } = useProgress();

  return (
    <>
      <MatrixRain />

      <AudioPlayer />
      {/* <Loader />
      {progress === 100 && <Experience />} */}
      <Experience />
    </>
  );
}

export default App;
