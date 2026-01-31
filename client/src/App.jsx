import { useEffect, useRef , useState} from "react";
import { setupCanvas , startStroke , endStroke ,addPoint, applyServerState, startRemoteStroke, addRemotePoint
         ,endRemoteStroke,clearRemoteStrokes} from "./canvas";
import socket, {registerCanvasStateHandler, requestCanvasState, undoUser, undoGlobal, redo, sendCursorPosition} from "./websockets";

let currentStrokeId = null;
let currentStrokeData = null;

function getUserColor(userId){
   let hash=0;
    for(let i=0;i<userId.length;i++){
      hash= userId.charCodeAt(i) + ((hash <<5) - hash);
    }
    const color= `hsl(${hash % 360}, 70%, 55%)`;
    return color;
}

function throttle(fn,limit){
  let lastCall=0;
  return function(...args){
    const now= Date.now();
    if(now - lastCall >= limit){
      lastCall= now;
      fn(...args);
    }
  };
}


function App() {  
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  
  const [color,setColor]= useState("#ffffffff");
  const [tool,setTool]= useState("brush");
  const [width,setWidth]= useState(2);
  const [cursors,setCursors]= useState({});
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

    registerCanvasStateHandler({
      handleCanvasState: (operations) => {
        clearRemoteStrokes();
        applyServerState(operations,ctx);
      },
      handleRemotePoint: (data) => {
        const { x, y, strokeId, color, width, tool } = data;

        if(color!== undefined){
          startRemoteStroke(strokeId, { color, width, tool });
        }
        addRemotePoint(ctx, strokeId, x, y);
      },
      handleRemoteEnd: (strokeId) => {
        endRemoteStroke(strokeId);
      },
      handleCursorUpdate: ({userId,x,y})=>{
        setCursors((prevCursors)=>{
          const existing= prevCursors[userId];
          return {
            ...prevCursors,
            [userId]: {x,
              y,
             color: existing?.color || getUserColor(userId),
             lastSeen: Date.now()
            }
          };
        });
      }
    });
     
    requestCanvasState();
    const throttledCursorSend= throttle(sendCursorPosition,40);

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
       const {x,y} = getMousePosition(event);

      throttledCursorSend(x,y);

       if(!currentStrokeId) return;

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

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setCursors((prevCursors) => {
        const updatedCursors = {};
        for (const [id, pos] of Object.entries(prevCursors)) {
          if (now - pos.lastSeen < 3000) {
            updatedCursors[id] = pos;
          }
        }
        return updatedCursors;
      });
    }, 1000);

    return () => clearInterval(interval);
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
    <div className="cursor-layer">
  {Object.entries(cursors).map(([id, pos]) => (
    <div
      key={id}
      className="cursor"
      style={{
        left: pos.x,
        top: pos.y,
        backgroundColor: pos.color
      }}
    />
  ))}
</div>
  </div>
);

}

export default App;
