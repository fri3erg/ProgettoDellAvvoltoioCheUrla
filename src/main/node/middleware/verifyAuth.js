const verifyAuth = (...allowedAuth) => {
  return (req, res, next) => {
    if (!req?.authorities) return res.sendStatus(401);
    const authArray = [...allowedAuth];
    console.log(authArray);
    console.log(req.authorities);
    //per ogni ruolo che abbiamo controlliamo se è permesso. Se ne abbiamo almeno uno accettato allora va bene
    const result = request.authorities.map(authority => authArray.includes(authority)).find(value => value === true);
    if (!result) {
      return res.sendStatus(401);
    }
    next();
  };
};

module.exports = verifyAuth;