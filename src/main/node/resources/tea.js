const express = require('express'); //import express

const auth = require('../middleware/auth');

const teaService2 = require('../service/TeaService2');

// 1.
const router = express.Router();

router.get('/tea', auth, (req, res, next) => {
  const cId = req.user.user_id;

  const type = req.query.type;
  let t = teaService2.getTeaType(type);
  res.json({ userId: cId, message: t, test: 't' }); // dummy function for now
});
// 4.
module.exports = router; // export to use in server.js
