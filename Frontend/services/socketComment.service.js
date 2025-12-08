import io from "socket.io-client";

const socket = io("https://unfacaded-nylah-staid.ngrok-free.dev", {
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 5,
  transports: ["websocket", "polling"],
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

// Escucha únicamente comments_fetched; devuelve función de cleanup
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