import { Server } from "socket.io";

export const config = {
  api: {
    bodyParser: false,
  },
};

const ioHandler = (req, res) => {
  if (!res.socket.server.io) {
    console.log("*First use, starting socket.io*");
    const path = "/api/socket/io";
    const httpServer = res.socket.server;
    const io = new Server(httpServer, {
      path: path,
      addTrailingSlash: false,
      cors: {
          origin: "*",
          methods: ["GET", "POST"]
      }
    });
    res.socket.server.io = io;

    io.on("connection", (socket) => {
      
      socket.on("join-document", (documentId, user) => {
        socket.join(documentId);
        // Broadcast presence
        socket.to(documentId).emit("user-joined", user); // user: { id, name, color }
      });

      // Text Sync (Simple Broadcast)
      socket.on("send-changes", (data) => {
          // data: { documentId, lineId, content, patches... }
          socket.to(data.documentId).emit("receive-changes", data);
      });
      
      // Cursor Sync
      socket.on("cursor-move", (data) => {
          // data: { documentId, userId, userName, color, line, offset }
          socket.to(data.documentId).emit("cursor-update", data);
      });

      socket.on("disconnect", () => {
        // console.log("Client disconnected");
      });
    });
  }
  res.end();
};

export default ioHandler;
