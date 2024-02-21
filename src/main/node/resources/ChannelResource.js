const express = require('express'); //import express

const channelService = require('../service/ChannelService');
const User = require('../model/user');
const auth = require('../middleware/auth');

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
/*
router.get('/channel-search/filtered', auth, async (req, res) => {
  try {
    const ret = await new channelService().searchChannel(req.user, req.user.username, req.query.name);
    res.status(200).json(ret);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err.message);
  }
});
*/
router.post('/channels/add-people', auth, async (req, res) => {
  try {
    const ret = await new channelService().addPeopleToChannel(req.user, req.user.username, req.query.channelId, req.body);
    res.status(200).json(ret);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err.message);
  }
});

router.get('/channels/:id', auth, async (req, res) => {
  try {
    const ret = await new channelService().getChannel(req.user, req.user.username, req.params.id);

    res.status(200).json(ret);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err.message);
  }
});

router.get('/channels/get/random', auth, async (req, res) => {
  try {
    const ret = await new channelService().getRandomChannelList(parseInt(req.query.size));
    res.status(200).json(ret);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err.message);
  }
});

router.delete('/channels/:id', auth, async (req, res) => {
  try {
    const ret = await new channelService().deleteChannel(req.user, req.params.id);
    res.status(200).json(ret);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err.message);
  }
});

router.get('/channels/sub/get/:name', auth, async (req, res) => {
  try {
    const ret = await new channelService().getChannelSubscribedTo(req.user, req.user.username, req.params.name);
    res.status(200).json(ret);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err.message);
  }
});

router.get('/channels/sub/count/:name', auth, async (req, res) => {
  try {
    const ret = await new channelService().countChannelSubscribedTo(req.user, req.user.username, req.params.name);
    res.status(200).json(ret);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err.message);
  }
});

router.post('/channels', auth, async (req, res) => {
  try {
    let channel = await new channelService().insertOrUpdateChannel(req.body.channel, req.user, req.user.username);
    res.status(201).json(channel);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err.message);
  }
});

router.post('/channels/edit', auth, async (req, res) => {
  try {
    let channel = await new channelService().editChannel(req.body.channel, req.user);
    res.status(201).json(channel);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err.message);
  }
});

router.post('/channels/edit-description', auth, async (req, res) => {
  try {
    let body = req.body;
    let channel = await new channelService().editChannelDescription(req.body.channel, req.user);
    res.status(201).json(channel);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err.message);
  }
});

router.get('/channels-mod/', auth, async (req, res) => {
  try {
    const ret = await new channelService().listModChannels(parseInt(req.query.page), parseInt(req.query.size), req.user.username);
    res.status(200).json(ret);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err.message);
  }
});

module.exports = router; // export to use in server.js
