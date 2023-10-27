const express = require('express'); //import express
require('dotenv').config();
require('../config/database');
const squealService = require('../service/SquealService');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../model/user');
const auth = require('../middleware/auth');
const verifyAuth = require('../middleware/verifyAuth');

// 1.
const router = express.Router();

router.get('/squeal-list', auth, async (req, res) => {
  try {
    if (!auth) {
      //TODO: AnonymousSqueals()
    }
    const ret = await new squealService().getSquealList(req.page, req.size, req.user, req.user.username);
    res.status(200).json(ret);
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
});

router.get('/squeal-by-user/:username', auth, async (req, res) => {
  try {
    const ret = await new squealService().getSquealsSentByUser(req.page, req.size, req.user, req.user.username, req.params.username);
    res.status(200).json(ret);
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
});

router.get('/squeals-destination', auth, async (req, res) => {
  try {
    const ret = await new squealService().getSquealDestination(req.user, req.user.username, req.query.name);
    res.status(200).json(ret);
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
});

router.post('/squeals', auth, async (req, res) => {
  try {
    let squeal = await new squealService().insertOrUpdate(req.body.squeal, req.user, req.user.username);
    console.log(squeal);
    res.status(201).json(squeal);
  } catch (err) {
    console.log(err);
  }
});

module.exports = router; // export to use in server.js
