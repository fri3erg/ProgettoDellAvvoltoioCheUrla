const jwt = require("jsonwebtoken");

const config = process.env;

const verifyToken = (req, res, next) => {
  
  const token =  req.headers.authorization;

  if (!token || token.split(' ').length<2) {
    return res.status(403).send("A token is required for authentication");
  }
  try {
    const t1 = token.split(' ')[1];
    const decoded = jwt.verify(t1, config.TOKEN_KEY);
    req.user = decoded;
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
  return next();
};

module.exports = verifyToken;
