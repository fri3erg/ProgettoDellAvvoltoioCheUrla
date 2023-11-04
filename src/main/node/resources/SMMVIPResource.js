const express = require('express'); //import express
require('dotenv').config();
require('../config/database');
const mongoose = require('mongoose');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const user = require('../model/user');
const auth = require('../middleware/auth');
const smmVIP = require('../model/smmVIP');
const SMMVIPService = require('../service/SMMVIPService');
const squealService = require('../service/SquealService');

const router = express.Router();

//!non puoi essere cliente di più smm

//ritorna tutti i smmvip ✅
//chiamata dall'utente quando vuole visualizzare tutti i smm
router.get('/smmvips', auth, async (req, res) => {
  try {
    const vips = await smmVIP.find({});
    res.status(200).json(vips);
  } catch (err) {
    res.status(500).send();
  }
});

//ritorna l'oggetto smmvip che ha come ID quello che passiamo come parametro ✅
router.get('/smmvips/:_id', auth, async (req, res) => {
  try {
    const vip = await smmVIP.find({ _id: req.params._id });
    res.status(200).json(vip);
  } catch (err) {
    res.status(500).send();
  }
});

//aggiungimi come cliente del smm ✅
//chiamata dall'utente quando vuole diventare cliente di un smm
//!togliere la possibilità di duplicati
router.post('/add-smm/:_id', auth, async (req, res) => {
  try {
    const smmId = req.params._id;
    const userName = req.user.username;
    const thisUser = await user.findOne({ login: userName });
    if (!thisUser.authorities) {
      return res.status(401).send('Non hai i permessi');
    } else {
      authArray = ['ROLE_ADMIN', 'ROLE_VIP'];
      const result = thisUser.authorities.map(authority => authArray.includes(authority)).find(value => value === true);

      if (!result) {
        res.status(401).send('Non hai i permessi');
      } else {
        await new SMMVIPService().addSMM(smmId, thisUser._id);
        res.status(200);
      }
    }
  } catch (err) {
    res.status(500).send();
  }
});

//dammi oggetto di tutti i clienti del smm ✅
//chiamato dal smm quando vuole visualizzare tutti i suoi clienti
router.get('/smmclients/:_id', auth, async (req, res) => {
  try {
    const userName = req.user.username;
    const thisUser = await user.findOne({ login: userName });

    if (!thisUser.authorities) {
      return res.status(401).send('Non hai i permessi');
    } else {
      authArray = ['ROLE_ADMIN', 'ROLE_SMM'];
      const result = thisUser.authorities.map(authority => authArray.includes(authority)).find(value => value === true);

      if (!result) {
        res.status(401).send('Non hai i permessi');
      } else {
        const urlId = req.params._id;
        if (urlId.match(/^[0-9a-fA-F]{24}$/)) {
          const vip = await smmVIP.findOne({ _id: urlId });
          const result = vip.users;
          const clientsArray = await new SMMVIPService().idToObj(result);
          res.status(200).json(clientsArray);
        }
      }
    }
  } catch (err) {
    res.status(500).send();
  }
});

//id -> user ✅
router.get('/clientuser/:_id', auth, async (req, res) => {
  try {
    const User = await user.findOne({ _id: req.params._id });
    res.status(200).json(User);
  } catch (err) {
    res.status(500).send();
  }
});

//feed del cliente
router.get('/client-feed/:name', auth, async (req, res) => {
  try {
    const ret = await new squealService().getSquealList(parseInt(req.query.page), parseInt(req.query.size), req.user, req.params.name);
    res.status(200).json(ret);
  } catch (err) {
    return res.status(400).send(err.message);
  }
});

//postare per clienti
router.post('/client-post/:name', auth, async (req, res) => {
  try {
    let squeal = await new squealService().insertOrUpdate(req.body, req.user, req.params.name);
    console.log(squeal);
    res.status(201).json(squeal);
  } catch (err) {
    return res.status(400).send(err.message);
  }
});

router.get('/squeals-destination/smm/', auth, async (req, res) => {
  try {
    const ret = await new squealService().getSquealDestination(req.user, req.query.name, req.query.search);
    res.status(201).json(ret);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err.message);
  }
});

module.exports = router; // export to use in server.js
