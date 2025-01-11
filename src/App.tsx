import { useEffect, useState, Suspense } from "react";
import { useAppSelector, useAppDispatch } from "./app/hooks";
import { setSteps } from "./app/actions/stepCounterActions";
import io from "socket.io-client";

import Experience from "./components/Experience/Experience";
import AudioPlayer from "./components/AudioPlayer/AudioPlayer";
import OverlayText from "./components/Experience/OverlayText";
import MatrixRain from "./components/MatrixRain/MatrixRain";
import "./App.css";
import { useProgress } from "@react-three/drei";
const LoadingScreen = () => {
  const { progress, active } = useProgress();

  return (
    <div className={`loading-screen ${active ? "active" : "hidden"}`}>
      <div className="loading-screen-content">
        <h1 className="loading-screen-text">Loading... {progress.toFixed(0)}%</h1>
        <div className="progress_container">
          <div className="progress_bar" style={{ width: `${progress.toFixed(0)}%` }}></div>
        </div>
      </div>
    </div>
  );
};

function App() {
  const dev = process.env.NODE_ENV === "development";

  const dispatch = useAppDispatch();
  const [liveUsers, setLiveUsers] = useState(0);
  const steps = useAppSelector((state) => state.stepCounter.steps); // example store with Redux
  const [views, setViews] = useState(0); // example store with State

  useEffect(() => {
    // Connessione al server WebSocket tramite il reverse proxy
    const socket = io(dev ? "http://localhost:3001" : "https://stefanoscalfari.it:3001", {
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
      <LoadingScreen />
      <MatrixRain />
      <OverlayText steps={steps} totalviews={views} viewers={liveUsers} />
      <AudioPlayer />
      <Experience />
    </>
  );
}

export default App;
