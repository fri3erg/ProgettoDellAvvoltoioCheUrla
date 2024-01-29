const express = require('express'); //import express

const channelUserService = require('../service/ChannelUserService');
const User = require('../model/user');
const auth = require('../middleware/auth');

// 1.
const router = express.Router();

router.delete('/channel-users/:id', auth, async (req, res) => {
  try {
    let unsub = await new channelUserService().deleteSubscription(req.user, req.user.username, req.params.id);
    res.status(201).json(unsub);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err.message);
  }
});

router.get('/channel-users/:id', auth, async (req, res) => {
  try {
    let sub = await new channelUserService().addSubscription(req.user, req.user.username, req.params.id);
    res.status(201).json(sub);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err.message);
  }
});

router.get('/channels/get-subscribed/:id', auth, async (req, res) => {
  try {
    const ret = await new channelUserService().getPeopleFollowing(req.user, req.user.username, req.params.id);
    res.status(200).json(ret);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err.message);
  }
});

router.get('/channels/add-people', auth, async (req, res) => {
  try {
    const ret = await new channelUserService().addPeopleToChannel(req.user, req.user.username, req.query.channelId, req.query.username);
    res.status(200).json(ret);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err.message);
  }
});

module.exports = router; // export to use in server.js
