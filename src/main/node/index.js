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
  mycron = new cronService();
  var task = cron.schedule(' 0 */4 * * * ', () => {});
  task.start();
  var meantask = cron.schedule(' * * * * * ', () => {});
  meantask.start();
} catch (err) {
  console.log('err');
  console.log(err);
}
module.exports = { io };
