import { useEffect, useRef } from "react";
import { setupCanvas } from "./canvas";

function App() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setupCanvas(canvas);
  }, []);

  return <canvas ref={canvasRef} />;
}

export default App;
