const socketIO = require('socket.io');

const allowedOrigins = require('./config/allowedOrigins');
const notificationService = require('./service/NotificationService');
let io; // Declare io variable
let onlineUsers = [];

function addNewUser(userId, socketId) {
  !onlineUsers.some(user => user.userId === userId) && onlineUsers.push({ userId, socketId });
}

function removeUser(socketId) {
  onlineUsers = onlineUsers.filter(user => user.socketId !== socketId);
}

function getUser(userId) {
  return onlineUsers.find(user => user.userId === userId);
}

function sendNotification(message) {
  const user = getUser(message.destId);
  if (user) {
    console.log('sending notification');
    io.to(user.socketId).emit('getNotification', { message });
  }
  new notificationService().createNotification(message);
}
function initializeSocket(server) {
  io = socketIO(server, { cors: { origin: allowedOrigins } });

  io.on('connection', socket => {
    socket.on('addUser', user => {
      addNewUser(user._id.toString(), socket.id);
      console.log('user connected');
    });

    socket.on('disconnect', function () {
      console.log('user disconnected');
      removeUser(socket.id);
    });

    socket.on('sendNotification', message => {
      const user = getUser(message.destId);
      if (user) {
        console.log('sending notification');
        io.to(user.socketId).emit('getNotification', { message });
      }
      // Note: You might want to handle the notification service logic here as well
    });
  });
}

module.exports = { initializeSocket, io, getUser, sendNotification };
