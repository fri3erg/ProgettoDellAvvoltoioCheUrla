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
try {
  mycron = new cronService();
  var task = cron.schedule(' */20 * * * * ', () => {
    console.log(mycron.tempSqueal());
  });
  task.start();
} catch (err) {
  console.log('err');
  console.log(err);
}
