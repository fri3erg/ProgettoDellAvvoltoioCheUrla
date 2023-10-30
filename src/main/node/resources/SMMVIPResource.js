const express = require('express'); //import express
require('dotenv').config();
require('../config/database');
const mongoose = require('mongoose');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const user = require('../model/user');
const auth = require('../middleware/auth');
const verifyAuth = require('../middleware/verifyAuth');
const smmVIP = require('../model/smmVIP');
const SMMVIPService = require('../service/SMMVIPService');

const router = express.Router();

//!gestone degli errori e dei ROLE

//ritorna tutti gli oggetti smmvip ✅
router.get('/smmvips', auth, async (req, res) => {
  try {
    const vips = await smmVIP.find({});
    res.status(200).json(vips);
  } catch (err) {
    console.log(err);
  }
});

//ritorna l'oggetto smmvip che ha come ID quello che passiamo come parametro ✅
router.get('/smmvips/:_id', auth, async (req, res) => {
  try {
    const vip = await smmVIP.find({ _id: req.params._id });
    res.status(200).json(vip);
    /*smmVIP
      .findById(req.params._id)
      .then(vip => {
        res.status(200).json(vip);
      })
      .catch(err => {
        console.log(err);
      });*/
  } catch (err) {
    console.log(err);
  }
});

//aggiungimi come cliente del smm ✅
//!togliere la possibilità di duplicati
router.post('/add-smm/:_id', auth, async (req, res) => {
  try {
    verifyAuth('ROLE_VIP', 'ROLE_ADMIN');
    const smmId = req.params._id;
    const userName = req.user.username;
    const thisUser = await user.findOne({ login: userName });
    await new SMMVIPService().addSMM(smmId, thisUser._id);
    res.status(200);
  } catch (err) {
    console.log(err);
  }
});

//dammi tutti i clienti del smm
router.get('/smmclients/:_id', auth, async (req, res) => {
  try {
    verifyAuth('ROLE_SMM', 'ROLE_ADMIN');
    const vip = await smmVIP.find(req.params._id); //prendo il smm che ha l'id dell'url
    const result = vip.users;
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
  }
});

module.exports = router; // export to use in server.js
