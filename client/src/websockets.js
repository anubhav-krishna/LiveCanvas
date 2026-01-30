 import {io} from "socket.io-client";
 import {startRemoteStroke, addRemotePoint ,endRemoteStroke} from "./canvas.js";

 const socket = io("http://localhost:3000");

  socket.on("connect", () => {
    console.log("Connected to WebSocket server");
  });

   socket.on("draw:point", (data) => {
  const { x, y, strokeId, color, width, tool } = data;
   
  socket.on("draw:end", ({ strokeId }) => {
  endRemoteStroke(strokeId);
  });

  startRemoteStroke(strokeId, { color, width, tool });
  addRemotePoint(window.__canvasCtx, strokeId, x, y);
});
  socket.on("disconnect", () => {
    console.log("Disconnected from WebSocket server");
  });

 export default socket;