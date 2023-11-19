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
    if (!auth) {
      //TODO: AnonymousSqueals()
    }
    const ret = await new squealService().getSquealList(parseInt(req.query.page), parseInt(req.query.size), req.user, req.user.username);
    res.status(200).json(ret);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err.message);
  }
});

router.get('/user-chars', auth, async (req, res) => {
  try {
    const ret = await new squealService().getUserChars(req.user, req.user.username);
    res.status(200).json(ret);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err.message);
  }
});

router.get('/squeal-response/:id', auth, async (req, res) => {
  try {
    const ret = await new squealService().getSquealById(req.user, req.user.username, req.params.id);
    res.status(200).json(ret);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err.message);
  }
});

router.get('/squeal-comments/:id/:name', auth, async (req, res) => {
  try {
    const ret = await new squealService().getSquealComments(req.user, req.params.name, req.params.id);
    res.status(200).json(ret);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err.message);
  }
});

router.get('/squeal-made-by-user/:name', auth, async (req, res) => {
  try {
    const ret = await new squealService().getSquealMadeByUser(
      parseInt(req.query.page),
      parseInt(req.query.size),
      req.user,
      req.user.username,
      req.params.name
    );
    res.status(200).json(ret);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err.message);
  }
});

router.get('/squeal-made-by-user-count/:name', auth, async (req, res) => {
  try {
    const ret = await new squealService().countSquealMadeByUser(req.user, req.user.username, req.params.name);
    res.status(200).json(ret);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err.message);
  }
});

router.post('/geoloc/update', auth, async (req, res) => {
  try {
    const geo_loc = await new squealService().updateGeoLoc(req.body, req.user, req.user.username);
    console.log(geo_loc);
    res.status(200).json(geo_loc);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err.message);
  }
});
router.get('/geoloc/get/:id', auth, async (req, res) => {
  try {
    const geo_loc = await new squealService().getGeoLoc(req.params.id, req.user, req.user.username);
    console.log(geo_loc);
    res.status(200).json(geo_loc);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err.message);
  }
});

router.get('/squeal-by-channel/:id', auth, async (req, res) => {
  try {
    const ret = await new squealService().getSquealByChannel(
      parseInt(req.query.page),
      parseInt(req.query.size),
      req.user,
      req.user.username,
      req.params.id
    );
    res.status(200).json(ret);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err.message);
  }
});

router.get('/squeal-by-user/:username', auth, async (req, res) => {
  try {
    const ret = await new squealService().getSquealsSentByUser(
      parseInt(req.query.page),
      parseInt(req.query.size),
      req.user,
      req.user.username,
      req.params.username
    );
    res.status(200).json(ret);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err.message);
  }
});

router.get('/direct-squeal-preview', auth, async (req, res) => {
  try {
    const ret = await new squealService().getDirectSquealPreview(req.user, req.user.username);
    res.status(200).json(ret);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err.message);
  }
});

router.get('/squeals-destination', auth, async (req, res) => {
  try {
    const ret = await new squealService().getSquealDestination(req.user, req.user.username, req.query.name);
    res.status(200).json(ret);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err.message);
  }
});

router.post('/squeals', auth, async (req, res) => {
  try {
    let squeal = await new squealService().insertOrUpdate(req.body.squeal, req.user, req.user.username, req.body.geoLoc);
    console.log(squeal);
    res.status(201).json(squeal);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err.message);
  }
});

module.exports = router; // export to use in server.js
