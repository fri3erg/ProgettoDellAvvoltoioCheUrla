const socketIO = require('socket.io');

const allowedOrigins = require('./config/allowedOrigins');
const notification = require('./model/notification');
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

async function sendNotification(message) {
  const user = getUser(message.destId);
  if (user) {
    console.log('sending notification');
    io.to(user.socketId).emit('getNotification', { message });
  }
  await createNotification(message);
}

async function createNotification(message) {
  let newNotification = new notification({
    username: message.username,
    reaction: message.reaction,
    body: message.body,
    destId: message.destId,
    profile_img: message.profile_img,
    profile_img_content_type: message.profile_img_content_type,
    timestamp: message.timestamp,
    type: message.type,
    isRead: message.isRead,
  });

  newNotification = await message.save();

  if (!newNotification) {
    throw new Error('could not create');
  }
  return newNotification;
}

function initializeSocket(server) {
  io = socketIO(server, { cors: { origin: allowedOrigins } });

  io.on('connection', socket => {
    socket.on('addUser', user => {
      if (user && user._id) {
        addNewUser(user._id.toString(), socket.id);
        console.log('user connected');
      }
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
