import config from "../api/config";

const sockets = {};

export const connectToSocket = (key, roomName, onMessage, onClose) => {
  if (sockets[key]) {
    sockets[key].close();
  }

  const url = `${config.webSocketUrl}/${key}/${roomName}/`
  const socket = new WebSocket(url);

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (onMessage) onMessage(data);
  };

  socket.onclose = () => {
    console.log(`${key} socket disconnected`);
    if (onClose) onClose();
    delete sockets[key];
  };

  sockets[key] = socket;
};

export const sendMessageSocket = (key, message) => {
  const socket = sockets[key];
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({ message }));
  }
};

export const closeSocket = (key) => {
  if (sockets[key]) {
    sockets[key].close();
    delete sockets[key];
  }
};

export const closeAllSockets = () => {
  Object.keys(sockets).forEach((key) => {
    sockets[key].close();
  });
  Object.keys(sockets).forEach((key) => delete sockets[key]);
};
