import { useEffect, useRef , useState} from "react";
import { setupCanvas , startStroke , endStroke ,addPoint, applyServerState } from "./canvas";
import socket, { undoUser, undoGlobal,redo } from "./websockets";

let currentStrokeId = null;
let currentStrokeData = null;

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

     window.__canvasCtx = ctx;

     if(window.__pendingCanvasState){
      applyServerState(window.__pendingCanvasState,ctx);
      window.__pendingCanvasState= null;
     }

  socket.emit("request:state"); 
  
   const getMousePosition = (event)=>{
     const rect = canvas.getBoundingClientRect();
     return {
       x: event.clientX - rect.left,
       y: event.clientY - rect.top
     };
   };

    const onMouseDown = (event) => {
      const {x,y} = getMousePosition(event);

    currentStrokeId = crypto.randomUUID();
    currentStrokeData = {
      id: currentStrokeId,
      color: colorRef.current,
      width: widthRef.current,
      tool: toolRef.current,
      points: [{x,y}]
    };
    startStroke(x,y,currentStrokeData);

    socket.emit("draw:point",{
      x,
      y,
      strokeId: currentStrokeId,
      color: colorRef.current,
      width: widthRef.current,
      tool: toolRef.current
    });
  };

    const onMouseMove = (event) => {
  
      if (!currentStrokeId) return;

      const {x,y} = getMousePosition(event);
      addPoint(x,y,contextRef.current);
      currentStrokeData.points.push({x,y});
      
      socket.emit("draw:point",{
        x,
        y,
        strokeId: currentStrokeId
      });
    };

    const onMouseUp = () => {
     if (!currentStrokeId || !currentStrokeData) return;

    socket.emit("draw:end", { strokeId: currentStrokeId });
    socket.emit("stroke:commit", currentStrokeData);

    endStroke();
    currentStrokeId = null;
    currentStrokeData = null;
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
  <button onClick={() => undoUser()}>Undo(Mine)</button>
  <button onClick={() => undoGlobal()}>Undo(Global)</button>
  <button onClick={() => redo()}>Redo</button>

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
