import { Server } from "socket.io";


let io;

export const initializeSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: 'http://localhost:5173',
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`🟢 Cliente conectado: ${socket.id}`);


    socket.on("join_topic", (topicoId) => {
      const roomName = `topico_${topicoId}`;
      socket.join(roomName);
      console.log(`🚪 Cliente ${socket.id} entró a la sala: ${roomName}`);
    });
    



    

    socket.on("leave_topic", (topicoId) => {
      const roomName = `topico_${topicoId}`;
      socket.leave(roomName);
    });

    socket.on("disconnect", () => {
      console.log(`🔴 Cliente desconectado: ${socket.id}`);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) throw new Error("Socket.io no ha sido inicializado");
  return io;
};