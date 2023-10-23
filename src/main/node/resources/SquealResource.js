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

router.post('/authenticate', async (req, res) => {
  try {
  } catch (err) {
    console.log(err);
  }
});

router.get('/squeal-list', auth, async (req, res) => {
  try {
    console.log('1');
    let ret = squealService.getSquealList(req.page, req.size, req.user.user_id);
    console.log(ret);
    res.status(200).json(ret);
  } catch (err) {
    return res.status(405).send('test');
    console.log(err);
  }
});

router.post('/register', async (req, res) => {
  try {
  } catch (err) {
    console.log(err);
  }
});

module.exports = router; // export to use in server.js
