const socketIo = require("socket.io");

let io;

// Função para inicializar o socket.io
exports.initialize = (server) => {
  io = socketIo(server, {
    cors: {
      origin: "*", // Permite conexões de qualquer origem (ajuste conforme necessário)
    },
  });
  return io;
};

// Função para obter a instância do socket.io
exports.getIo = () => {
  if (!io) {
    throw new Error("Socket.io não inicializado");
  }
  return io;
};