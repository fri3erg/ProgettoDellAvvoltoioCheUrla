const mongoose = require('mongoose');
require('dotenv').config();
const { MONGO_URI } = process.env;
const winston = require('winston');
const config = require('../config/env.js');

const muri = MONGO_URI || config.MONGO_URI;

// Create a Winston logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [new winston.transports.Console(), new winston.transports.File({ filename: 'squealerLogDb.log' })],
});

exports.connect = () => {
  console.log('connecting to database: ' + muri);
  mongoose.set('useCreateIndex', true);
  mongoose.set('useFindAndModify', false);
  // Connecting to the database
  mongoose
    .connect(muri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log('Successfully connected to database');
      logger.log('info', 'running');
    })
    .catch(error => {
      logger.log('info', 'database failed ' + muri);
      console.log('database connection failed. exiting now...');
      console.error(error);
      process.exit(1);
    });
};
