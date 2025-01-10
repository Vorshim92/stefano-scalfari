import { Loader, useProgress } from "@react-three/drei";
import Experience from "./components/Experience/Experience";
import "./App.css";

function App() {
  const { progress } = useProgress();

  return (
    <>
      <Loader />
      {progress === 100 && <Experience />}
      {/* <Experience /> */}
    </>
  );
}

export default App;
