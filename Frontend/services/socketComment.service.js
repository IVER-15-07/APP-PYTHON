import io from "socket.io-client";

const socket = io("http://localhost:3000", {
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 5,
});


socket.on("connect", () => {
  console.log(" Conectado al servidor WebSocket");
});

socket.on("disconnect", () => {
  console.log(" Desconectado del servidor WebSocket");
});

socket.on("connect_error", (error) => {
  console.error(" Error de conexión:", error);
});



// Funciones para suscribirse a eventos específicos
export const onNewComment = (callback) => {
  socket.on("new_comment", (data) => {
    console.log("📨 Nuevo comentario recibido:", data);
    callback(data);
  });
};


export const onCommentAnswered = (callback) => {
  socket.on("comment_answered", (data) => {
    console.log("📨 Respuesta a comentario recibida:", data);
    callback(data);
  });
};

export const onCommentsFetched = (callback) => {
  socket.on("comments_fetched", (data) => {
    console.log("📨 Comentarios cargados:", data);
    callback(data);
  });
};






export const disconnectSocket = () => {
  socket.disconnect();
  console.log("🔌 Desconectado del WebSocket");
};

export default socket;
