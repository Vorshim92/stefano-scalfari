import { Loader, useProgress } from "@react-three/drei";
import MatrixRain from "./components/MatrixRain/MatrixRain";
import AudioPlayer from "./components/AudioPlayer/AudioPlayer";
import Experience from "./components/Experience/Experience";
import "./App.css";

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
