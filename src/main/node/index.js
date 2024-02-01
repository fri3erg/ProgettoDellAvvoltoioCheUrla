const http = require('http');
const cronService = require('./service/CronService');
const app = require('./app');
const winston = require('winston');
require('dotenv').config();
const { initializeSocket, io } = require('./socket');
const server = http.createServer(app);
var cron = require('node-cron');
const { API_PORT } = process.env;
const port = API_PORT || 8000;
global.rootDir = __dirname;
global.startDate = null;

// Create a Winston logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [new winston.transports.Console(), new winston.transports.File({ filename: 'squealerLog.log' })],
});

// Initialize socket.io
initializeSocket(server);

server.listen(port, () => {
  global.startDate = new Date();
  console.log(`Server running on port ${port}`);
});

logger.log('info', 'running');
console.log('running');

try {
  const my_cron = new cronService();
  const task = cron.schedule('0 8 * * *', () => {
    my_cron.GptSqueal();
  });
  task.start();
  const meantask = cron.schedule(' * * * * * ', () => {
    my_cron.meanGptSqueal();
  });
  meantask.start();
} catch (err) {
  console.log('err');
  console.log(err);
}
module.exports = { io };
