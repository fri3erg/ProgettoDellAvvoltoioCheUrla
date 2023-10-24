const express = require('express'); //import express
require('dotenv').config();
require('../config/database');
const squealService = require('../service/SquealService');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../model/user');
const auth = require('../middleware/auth');

// 1.
const router = express.Router();

router.get('/squeal-list', auth, async (req, res) => {
  try {
    const ret = await new squealService().getSquealList(req.page, req.size, req.user);
    res.status(200).json(ret);
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
});

module.exports = router; // export to use in server.js
