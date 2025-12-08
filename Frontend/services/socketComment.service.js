import io from "socket.io-client";

const URL = "https://unfacaded-nylah-staid.ngrok-free.dev";

export const socket = io(URL, {
  autoConnect: true,
  transports: ["websocket"],
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

export const joinTopicRoom = (topicId) => {
  socket.emit("join_topic", Number(topicId));
};

export const leaveTopicRoom = (topicId) => {
  socket.emit("leave_topic", Number(topicId));
};

// Escucha nuevos comentarios creados
export const onNewComment = (callback) => {
  const handler = (data) => {
    console.log("💬 Nuevo comentario:", data);
    callback(data);
  };

  socket.on("new_comment", handler);
  return () => socket.off("new_comment", handler);
};

// Escucha nuevas respuestas a comentarios
export const onNewReply = (callback) => {
  const handler = (data) => {
    console.log("💬 Nueva respuesta:", data);
    callback(data);
  };

  socket.on("new_reply", handler);
  return () => socket.off("new_reply", handler);
};

// Escucha comentarios cargados
export const onCommentsFetched = (callback, { topicId } = {}) => {
  const handler = (data) => {
    const incomingTopicId = Number(data?.topicId ?? data?.topicoId);
    if (topicId && incomingTopicId !== Number(topicId)) return;
    console.log("📨 Comentarios cargados:", data);
    callback(data);
  };

  socket.on("comments_fetched", handler);
  return () => socket.off("comments_fetched", handler);
};

export const disconnectSocket = () => {
  socket.disconnect();
  console.log("🔌 Desconectado del WebSocket");
};

export default socket;