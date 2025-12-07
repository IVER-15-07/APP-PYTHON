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
    console.log(` Cliente conectado: ${socket.id}`);

    // Eventos de comentarios
    socket.on("subscribe_teacher_comments", (teacherId) => {
      socket.join(`teacher_${teacherId}`);
      console.log(` Cliente suscrito a comentarios del profesor ${teacherId}`);
    });

    socket.on("unsubscribe_teacher_comments", (teacherId) => {
      socket.leave(`teacher_${teacherId}`);
      console.log(` Cliente desuscrito de comentarios del profesor ${teacherId}`);
    });

    socket.on("disconnect", () => {
      console.log(` Cliente desconectado: ${socket.id}`);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io no ha sido inicializado");
  }
  return io;
};
