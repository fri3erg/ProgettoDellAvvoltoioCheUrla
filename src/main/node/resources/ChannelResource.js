const express = require('express'); //import express
require('dotenv').config();
require('../config/database');
const squealService = require('../service/SquealService');
const channelService = require('../service/ChannelService');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../model/user');
const auth = require('../middleware/auth');
const verifyAuth = require('../middleware/verifyAuth');

// 1.
const router = express.Router();

router.get('/channel-search', auth, async (req, res) => {
  try {
    const ret = await new channelService().searchChannel(req.user, req.user.username, req.query.name);
    res.status(200).json(ret);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err.message);
  }
});

router.post('/channels', auth, async (req, res) => {
  try {
    let channel = await new channelService().insertOrUpdateChannel(req.body.channel, req.user, req.user.username);
    console.log(channel);
    res.status(201).json(channel);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err.message);
  }
});

module.exports = router; // export to use in server.js
