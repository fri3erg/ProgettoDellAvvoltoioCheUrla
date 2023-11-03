const express = require('express'); //import express

const channelUserService = require('../service/ChannelUserService');
const User = require('../model/user');
const auth = require('../middleware/auth');

// 1.
const router = express.Router();

router.delete('/channel-users/:id', auth, async (req, res) => {
  try {
    let unsub = await new channelUserService().deleteSubscription(req.params.id, req.user, req.user.username);
    console.log(unsub);
    res.status(201).json(unsub);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err.message);
  }
});

module.exports = router; // export to use in server.js
