require('dotenv').config();
require('./config/database').connect();
const express = require('express');
const cors = require('cors');
const next = require('next');
const corsOptions = require('./config/corsOptions');
const path = require('path');

const auth = require('./middleware/auth');
const accountResource = require('./resources/AccountResource'); // import the routes
const squealResource = require('./resources/SquealResource');
const channelResource = require('./resources/ChannelResource');
const SMMVIPResource = require('./resources/SMMVIPResource');
const ReactionResource = require('./resources/ReactionResource');
const ChannelUserResource = require('./resources/ChannelUserResource');
const NotificationResource = require('./resources/NotificationResource');

const { API_PORT } = process.env;
const PORT = API_PORT || 8000;
const MoneyResource = require('./resources/MoneyResource');

const nodeenv = process.env.NODE_ENV || 'production';
const dev = nodeenv !== 'production';

const app = express();

app.use(express.urlencoded({ extended: true }));
app.enable('trust proxy');
app.use(express.json({ limit: '50mb' }));
// Assuming corsOptions is defined somewhere
app.use(cors(corsOptions));

//app.use(express.static(path.join(__dirname, 'app')));
// Serve Angular App from a specific base, e.g., '/angular'
app.use(express.static(path.join(__dirname, 'app')));

app.use('/api', accountResource);
app.use('/api', squealResource);
app.use('/api', channelResource);
app.use('/api', SMMVIPResource);
app.use('/api', ReactionResource);
app.use('/api', ChannelUserResource);
app.use('/api', NotificationResource);
app.use('/api', MoneyResource);

if (!dev) {
  const appNextOptions = {
    dev: dev,
    customServer: true,
    conf: require('./app/avvoltoio-smm/next.config.js'),
    dir: path.resolve(__dirname, 'app', 'avvoltoio-smm'),
    port: PORT,
  };

  const appNext = next(appNextOptions);
  const handle = appNext.getRequestHandler();

  appNext.prepare().then(() => {
    app.use('/smm/_next', express.static(path.join(__dirname, 'app', 'avvoltoio-smm', 'nextbuild')));
    app.all('/smm/*', (req, res) => {
      return handle(req, res);
    });
  });
}
/*

const mongoCredentials = {
  user: "site222347",
  pwd: "cao4aePh",
  site: "mongo_site222347"
}  
app.get('/db/create', async function (req, res) {
  res.send(await mymongo.create(mongoCredentials))
});
app.get('/db/search', async function (req, res) {
  res.send(await mymongo.search(req.query, mongoCredentials))
});
*/

app.get('/welcome', auth, (req, res) => {
  res.status(200).send('Welcome 🙌 ');
});

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/')) {
    return next();
  }
  res.sendFile(path.join(__dirname, 'app/index.html'));
});

// This should be the last route else any after it won't work
app.use('*', (req, res) => {
  res.status(404).json({
    success: 'false',
    message: 'Page not found',
    error: {
      statusCode: 404,
      message: 'You reached a route that is not defined on this server',
    },
  });
});

module.exports = app;
