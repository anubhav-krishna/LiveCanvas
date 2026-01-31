 import {io} from "socket.io-client";
 import {applyServerState,startRemoteStroke,addRemotePoint,endRemoteStroke, clearRemoteStrokes} from "./canvas.js";

  window.__pendingCanvasState= null;

 const socket = io("http://localhost:3000");

  socket.on("connect", () => {
    console.log("Connected to WebSocket server");
  });

  socket.on("draw:point", (data) => {
    const ctx = window.__canvasCtx;
    if (!ctx) return;
    const { strokeId, x, y, color, width, tool } = data;
    if(color!==undefined){
    startRemoteStroke(strokeId, { color, width, tool });
    }
    addRemotePoint(ctx, strokeId, x, y);
  });

   socket.on("canvas:state", (operation) => {
    const ctx = window.__canvasCtx;
    if (!ctx){
      window.__pendingCanvasState = operation;
      return;
    }
     clearRemoteStrokes();
    applyServerState(operation, ctx);
  });

socket.on("draw:end", ({ strokeId }) => {
  endRemoteStroke(strokeId);
});

  export function undoUser(){
    socket.emit("undo:user");
  }

  export function undoGlobal(){
    socket.emit("undo:global");
  }

  export function redo(){
    socket.emit("redo");
  }

  socket.on("disconnect", () => {
    console.log("Disconnected from WebSocket server");
  });

 export default socket;