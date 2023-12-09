const http = require('http');
const cronService = require('./service/CronService');
const notificationService = require('./service/NotificationService');
const app = require('./app');
const allowedOrigins = require('./config/allowedOrigins');
const Squeal = require('./model/squeal');
const User = require('./model/user');

const server = http.createServer(app);
const io = require('socket.io')(server, { cors: { origin: allowedOrigins } });
var cron = require('node-cron');
const { API_PORT } = process.env;
const port = process.env.PORT || API_PORT;

let onlineUsers = [];

const addNewUser = (userId, socketId) => {
  !onlineUsers.some(user => user.userId === userId) && onlineUsers.push({ userId, socketId });
};

const removeUser = socketId => {
  onlineUsers = onlineUsers.filter(user => user.socketId !== socketId);
};

const getUser = userId => {
  return onlineUsers.find(user => user.userId === userId);
};

io.on('connection', socket => {
  socket.on('addUser', user => {
    addNewUser(user.clients._id, socket.id);
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
    new notificationService().createNotification(message);
  });
});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
console.log('running');

try {
  mycron = new cronService();
  var task = cron.schedule(' */30 * * * * ', () => {
    console.log(mycron.tempSqueal());
  });
  task.start();
  var meantask = cron.schedule(' * * * * * ', () => {
    console.log(mycron.meanGptSqueal());
  });
  meantask.start();
} catch (err) {
  console.log('err');
  console.log(err);
}
