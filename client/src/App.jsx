import { useEffect, useRef , useState} from "react";
import { setupCanvas , startStroke , endStroke , 
  addPoint,redrawCanvas, undo, redo } from "./canvas";
import socket from "./websockets";

let currentStrokeId = null;

function App() {
  
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  
  const [color,setColor]= useState("#ffffffff");
  const [tool,setTool]= useState("brush");
  const [width,setWidth]= useState(2);
  const colorRef = useRef(color);
  const toolRef = useRef(tool);
  const widthRef = useRef(width);

  useEffect(() => {
  colorRef.current = color;
  }, [color]);

  useEffect(() => {
  toolRef.current = tool;
  }, [tool]);

  useEffect(() => {
  widthRef.current = width;
  }, [width]);



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
     startStroke(x, y, {
    color: colorRef.current,
    width: widthRef.current,
    tool: toolRef.current
   });

   socket.emit("draw:point", {
    x,
    y,
    color: colorRef.current,
    width: widthRef.current,
    tool: toolRef.current,
    strokeId: currentStrokeId
   });

    };

    const onMouseMove = (event) => {
      if (!contextRef.current) return;

      const {x,y} = getMousePosition(event);
      addPoint(x,y,contextRef.current);

    socket.emit("draw:point", {
      x,
      y,
     color: colorRef.current,
     width: widthRef.current,
     tool: toolRef.current,
     strokeId: currentStrokeId
    });
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

return (
  <div className="app">
   <div className="toolbar">
  <button onClick={() => setTool("brush")}>Brush</button>
  <button onClick={() => setTool("eraser")}>Eraser</button>
  <button onClick={() => undo(contextRef.current, canvasRef.current)}>
  Undo
</button>

<button onClick={() => redo(contextRef.current, canvasRef.current)}>
  Redo
</button>

  <input
    type="color"
    value={color}
    onChange={(e) => setColor(e.target.value)}
  />

  <input
    type="range"
    min="1"
    max="20"
    value={width}
    onChange={(e) => setWidth(Number(e.target.value))}
  />
</div>


    <canvas ref={canvasRef} />
  </div>
);

}

export default App;
