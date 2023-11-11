const http = require('http');
const cronService = require('./service/CronService');
const app = require('./app');
const server = http.createServer(app);
var cron = require('node-cron');
const { API_PORT } = process.env;
const port = process.env.PORT || API_PORT;
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
console.log('running');
var task = cron.schedule(' */5 * * * * ', () => {
  console.log(new cronService().tempSqueal());
});
task.start();
