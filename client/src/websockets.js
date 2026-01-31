 import {io} from "socket.io-client";
//  import {applyServerState,startRemoteStroke,addRemotePoint,endRemoteStroke, clearRemoteStrokes} from "./canvas.js";

 const socket = io(import.meta.env.VITE_SOCKET_URL , {
  path : "/socket.io",
  transports: ["polling", "websocket"],
  reconnection : true,
 });
  
 //console.log("WebSocket URL:", import.meta.env.VITE_SOCKET_URL);

  let onCanvasState = null;
  let onRemotePoint = null;
  let onRemoteEnd = null;
  let onCursorUpdate= null;

  socket.on("connect", () => {
    console.log("Connected to WebSocket server: ", socket.id);
  });

  socket.on("draw:point", (data) => {
    if(onRemotePoint){
      onRemotePoint(data);
    }
  });

   socket.on("canvas:state", (operation) => {
     if(onCanvasState){
       onCanvasState(operation);
     }
  });

socket.on("draw:end", ({ strokeId }) => {
  if(onRemoteEnd){
    onRemoteEnd(strokeId);
  }
});

socket.on("cursor:update", (data) => {
  if(onCursorUpdate){
    onCursorUpdate(data);
  }
});

 export function registerCanvasStateHandler({
  handleCanvasState,
    handleRemotePoint,
    handleRemoteEnd,
    handleCursorUpdate
  }){
    onCanvasState=  handleCanvasState;
    onRemotePoint= handleRemotePoint;
    onRemoteEnd= handleRemoteEnd;
    onCursorUpdate= handleCursorUpdate;
  }

  export function requestCanvasState(){
    socket.emit("request:state");
  }

  export function undoUser(){
    socket.emit("undo:user");
  }

  export function undoGlobal(){
    socket.emit("undo:global");
  }

  export function redo(){
    socket.emit("redo");
  }

  export function sendCursorPosition(x,y){
    socket.emit("cursor:move", {x,y});
  }

  socket.on("disconnect", () => {
    console.log("Disconnected from WebSocket server");
  });

 export default socket;