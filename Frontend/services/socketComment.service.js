import io from "socket.io-client";

const URL = "http://localhost:3000"; // Tu backend local

export const socket = io(URL, {
  transports: ["websocket"],
  autoConnect: true
});

export const joinTopicRoom = (topicId) => {
  socket.emit("join_topic", Number(topicId));
};

export const leaveTopicRoom = (topicId) => {
  socket.emit("leave_topic", Number(topicId));
};

export const onNewComment = (cb) => {
  socket.on("new_comment", cb);
  // Retornar función de limpieza para off()
  return () => socket.off("new_comment", cb);
};

export const onNewReply = (cb) => {
  socket.on("new_reply", cb);
  return () => socket.off("new_reply", cb);
};
