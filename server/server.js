import express from "express";
import http from "http";
import { Server } from "socket.io";
 import { addOperation,undoGlobal,undoUser,redo,getState } from "./drawing-state.js";


const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  }
});
 io.on("connection", (socket) => {
  console.log("a user connected:", socket.id);

  socket.on("request:state", () => {
  socket.emit("canvas:state", getState());
});

   socket.on("draw:point", (stroke) => {
    socket.broadcast.emit("draw:point", stroke);
  });

  socket.on("draw:end", ({ strokeId }) => {
  socket.broadcast.emit("draw:end", { strokeId });
});

   
   socket.on("stroke:commit", (stroke) => {
     const operation = {
      id: stroke.id,
      userId: socket.id,
      type: "stroke",
      data: stroke
     };
      addOperation(operation);
      io.emit("canvas:state", getState());
    });

    socket.on("undo:user", () => {
      undoUser(socket.id);
    io.emit("canvas:state",getState());
  });
   
    socket.on("undo:global", () => {
    undoGlobal();
    io.emit("canvas:state",getState());
  });

    socket.on("redo", () => {
    redo();
    io.emit("canvas:state",getState());
  });

    socket.on("disconnect", () => {
    console.log("user disconnected:", socket.id);
  });

  socket.on("cursor:move", (data) => {
    socket.broadcast.emit("cursor:update", {
      userId: socket.id,
      x: data.x,
      y: data.y
    });
  });

});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});