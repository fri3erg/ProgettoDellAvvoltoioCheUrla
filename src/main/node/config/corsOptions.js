const whitelist = ['http://localhost:8080', 'http://localhost:9000', 'http://localhost:9001', 'http://localhost:27017'];

const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      //togliere !origin dopo lo sviluppo
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  optionsSuccessStatus: 200,
};

module.exports = corsOptions;
