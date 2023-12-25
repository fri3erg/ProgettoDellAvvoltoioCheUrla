require('dotenv').config();
require('./config/database').connect();
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');

const User = require('./model/user');
const auth = require('./middleware/auth');
const accountResource = require('./resources/AccountResource'); // import the routes
const squealResource = require('./resources/SquealResource');
const channelResource = require('./resources/ChannelResource');
const SMMVIPResource = require('./resources/SMMVIPResource');
const ReactionResource = require('./resources/ReactionResource');
const ChannelUserResource = require('./resources/ChannelUserResource');
const NotificationResource = require('./resources/NotificationResource');
const app = express();
app.use(express.urlencoded({ extended: true }));
app.enable('trust proxy');
app.use(express.json({ limit: '50mb' }));
//cors
app.use(cors(corsOptions));
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

app.use('/api', accountResource);
app.use('/api', squealResource);
app.use('/api', channelResource);
app.use('/api', SMMVIPResource);
app.use('/api', ReactionResource);
app.use('/api', ChannelUserResource);
app.use('/api', NotificationResource);

app.get('/welcome', auth, (req, res) => {
  res.status(200).send('Welcome 🙌 ');
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
