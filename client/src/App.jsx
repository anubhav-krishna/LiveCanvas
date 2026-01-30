import { useEffect, useRef } from "react";
import { setupCanvas , startStroke , endStroke , addPoint,redrawCanvas } from "./canvas";

function App() {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

     const ctx= setupCanvas(canvas);
     contextRef.current = ctx;

window.redraw = () => {
  redrawCanvas(contextRef.current, canvas);
};

   const getMousePosition = (event)=>{
     const rect = canvas.getBoundingClientRect();
     return {
       x: event.clientX - rect.left,
       y: event.clientY - rect.top
     };
   };

    const onMouseDown = (event) => {
      const {x,y} = getMousePosition(event);
      startStroke(x,y);
    };

    const onMouseMove = (event) => {
      if (!contextRef.current) return;

      const {x,y} = getMousePosition(event);
      addPoint(x,y,contextRef.current);
    };

    const onMouseUp = () => {
      endStroke();
    };

    canvas.addEventListener("mousedown", onMouseDown);
    canvas.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    return () => {
      canvas.removeEventListener("mousedown", onMouseDown);
      canvas.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

  }, []);

  return <canvas ref={canvasRef} />;
}

export default App;
