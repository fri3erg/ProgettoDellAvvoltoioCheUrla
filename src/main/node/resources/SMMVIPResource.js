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
const reactionService = require('../service/ReactionService');
const channelUserService = require('../service/ChannelUserService');
const channelService = require('../service/ChannelService');
const accountService = require('../service/AccountService');
const { request } = require('http');
const NotificationService = require('../service/NotificationService');

//const { Chat } = require('openai/resources');

const router = express.Router();

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

router.get('/get-id/smm', auth, async (req, res) => {
  try {
    const ret = await smmVIP.findOne({ user_id: req.user.user_id });
    res.status(200).json(ret);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err.message);
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
router.post('/account/add-smm', auth, async (req, res) => {
  try {
    const smmId = req.body.id;
    const userName = req.user.username;
    const thisUser = await user.findOne({ login: userName });
    if (!thisUser.authorities) {
      return res.status(401).send('Non hai i permessi');
    } else {
      const authArray = ['ROLE_ADMIN', 'ROLE_VIP'];
      const result = thisUser.authorities.map(authority => authArray.includes(authority)).find(value => value === true);

      if (!result) {
        res.status(401).send('Non hai i permessi');
      } else {
        await new SMMVIPService().addSMM(smmId, thisUser._id);
        res.status(201);
      }
    }
  } catch (err) {
    res.status(500).send();
  }
});

router.post('/account/add-client/', auth, async (req, res) => {
  try {
    const userName = req.user.username;
    const clientName = req.query.client;
    const notificationId = req.query.id;
    const ret = await new SMMVIPService().addClient(userName, clientName, notificationId);
    res.status(200).json(ret);
  } catch (err) {
    res.status(500).send();
  }
});

router.get('/account/ask-smm/:login', auth, async (req, res) => {
  try {
    const smmLogin = req.params.login;
    const userName = req.user.username;
    const notif = await new NotificationService().askSMM(smmLogin, userName);
    res.status(201).json(notif);
  } catch (err) {
    console.log(err);
  }
});

router.post('/remove-smm/:_id', auth, async (req, res) => {
  try {
    const smmId = req.params._id;
    const thisUser = await user.findOne({ login: req.user.username });
    if (!thisUser.authorities) {
      return res.status(401).send('Non hai i permessi');
    } else {
      await new SMMVIPService().removeSMM(smmId, thisUser._id);
      res.status(201);
    }
  } catch (err) {
    res.status(500).send();
  }
});

router.post('/remove-smm-login/:login', auth, async (req, res) => {
  try {
    const thisUser = await user.findOne({ login: req.user.username });
    if (!thisUser.authorities) {
      return res.status(401).send('Non hai i permessi');
    } else {
      const smm = await User.findOne({ login: req.params.login });
      if (!smm) {
        return res.status(401).send('Non valido');
      }
      const smmId = smm._id.toString();
      await new SMMVIPService().removeSMM(smmId, thisUser._id);
      res.status(201);
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
      authArray = ['ROLE_ADMIN', 'ROLE_SMM', 'ROLE_VIP'];
      const result = thisUser.authorities.map(authority => authArray.includes(authority)).find(value => value === true);

      if (!result) {
        res.status(401).send('Non hai i permessi');
      } else {
        const urlId = req.params._id;
        if (urlId.match(/^[0-9a-fA-F]{24}$/)) {
          const vip = await smmVIP.findOne({ _id: urlId });
          const result = vip.users;
          console.log(result);
          const clientsArray = await new SMMVIPService().idToObj(result);
          res.status(200).json(clientsArray);
        }
      }
    }
  } catch (err) {
    res.status(500).send();
  }
});

router.get('/smmclients-number', auth, async (req, res) => {
  try {
    const userName = req.user.username;
    const thisUser = await user.findOne({ login: userName });

    if (!thisUser.authorities) {
      return res.status(401).send('Non hai i permessi');
    } else {
      authArray = ['ROLE_ADMIN', 'ROLE_SMM', 'ROLE_VIP'];
      const result = thisUser.authorities.map(authority => authArray.includes(authority)).find(value => value === true);

      if (!result) {
        res.status(401).send('Non hai i permessi');
      } else {
        const vip = await smmVIP.findOne({ user_id: thisUser._id.toString() });
        const result = vip.users;
        const clientsArray = await new SMMVIPService().idToObj(result);
        res.status(200).json(clientsArray.length);
      }
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get('/smm-total-post-reactions', auth, async (req, res) => {
  try {
    const ret = await new SMMVIPService().getTotalPosReaction(req.user);
    res.status(200).json(ret);
  } catch (err) {
    return res.status(400).send(err.message);
  }
});

router.get('/squeal-response/smm/:id/:name', auth, async (req, res) => {
  try {
    const ret = await new squealService().getSquealById(req.user, req.params.name, req.params.id);
    res.status(200).json(ret);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err.message);
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

//feed del cliente ✅
router.get('/client-feed/:name', auth, async (req, res) => {
  try {
    const ret = await new squealService().getSquealListCmt(parseInt(req.query.page), parseInt(req.query.size), req.user, req.params.name);
    res.status(200).json(ret);
  } catch (err) {
    return res.status(400).send(err.message);
  }
});

router.get('/squeal-by-user/smm/:name', auth, async (req, res) => {
  try {
    const ret = await new squealService().getSquealMadeByUserCmt(
      parseInt(req.query.page),
      parseInt(req.query.size),
      req.user,
      req.user.username,
      req.params.name
    );
    res.status(200).json(ret);
  } catch (err) {
    return res.status(400).send(err.message);
  }
});

//postare per clienti ✅
router.post('/client-post/:name', auth, async (req, res) => {
  try {
    let squeal = await new squealService().insertOrUpdate(req.body, req.user, req.params.name, req.body.geoloc);
    let squealDTO = await new squealService().getSquealDTO(squeal, req.params.name);
    res.status(201).json(squealDTO);
  } catch (err) {
    return res.status(400).send(err.message);
  }
});

router.post('/client-squeal-reaction/create/:name', auth, async (req, res) => {
  try {
    let reaction = await new reactionService().insertOrUpdateReaction(req.body, req.user, req.params.name);
    res.status(201).json(reaction);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err.message);
  }
});

router.get('/smm/search', auth, async (req, res) => {
  try {
    const ret = await new SMMVIPService().getSMM(req.user, req.user.username, req.query.search);
    res.status(200).json(ret);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err.message);
  }
});
router.get('/smm/search-subbed', auth, async (req, res) => {
  try {
    const ret = await new SMMVIPService().getSMMSubbed(req.user, req.user.username, req.query.search);
    res.status(200).json(ret);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err.message);
  }
});

router.get('/channels/smm/:id/:name', auth, async (req, res) => {
  try {
    const ret = await new channelService().getChannel(req.user, req.params.name, req.params.id);
    res.status(200).json(ret);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err.message);
  }
});

router.get('/channel/subbed/:id/:name', auth, async (req, res) => {
  try {
    const ret = await new SMMVIPService().iAmSubbed(req.user, req.params.name, req.params.id);
    res.status(200).json(ret);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err.message);
  }
});

router.get('/channels/get-subscribed/smm/:name/:id', auth, async (req, res) => {
  try {
    const ret = await new channelUserService().getPeopleFollowing(req.user, req.params.name, req.params.id);
    res.status(200).json(ret);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err.message);
  }
});

router.get('/channels/count-subscribers/smm/:name/:id', auth, async (req, res) => {
  try {
    const ret = await new channelUserService().countPeopleFollowing(req.user, req.params.name, req.params.id);
    res.status(200).json(ret);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err.message);
  }
});

router.get('/squeals-destination/smm/:name', auth, async (req, res) => {
  try {
    const ret = await new squealService().getSquealDestination(req.user, req.params.name, req.query.search);
    res.status(200).json(ret);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err.message);
  }
});

router.get('/squeal-by-channel/smm/:id', auth, async (req, res) => {
  try {
    const ret = await new squealService().getSquealByChannelCmt(
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

router.post('/channels/smm/add-people/:name', auth, async (req, res) => {
  try {
    const ret = await new channelService().addPeopleToChannel(req.user, req.params.name, req.query.channelId, req.body.users);
    res.status(200).json(ret);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err.message);
  }
});

router.get('/users/search/smm/:name', auth, async (req, res) => {
  try {
    const ret = await new accountService().getUsersByName(req.user, req.params.name, req.query.search);
    res.status(200).json(ret);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err.message);
  }
});

router.get('/squeal-rank-reaction/:name', auth, async (req, res) => {
  try {
    const ret = await new squealService().getSquealRankByReaction(
      parseInt(req.query.page),
      parseInt(req.query.size),
      req.user,
      req.params.name
    );
    res.status(200).json(ret);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err.message);
  }
});

router.get('/squeal-rank-reaction-inverse/:name', auth, async (req, res) => {
  try {
    const ret = await new squealService().getSquealRankByReactionInverse(
      parseInt(req.query.page),
      parseInt(req.query.size),
      req.user,
      req.params.name
    );
    res.status(200).json(ret);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err.message);
  }
});

router.get('/channel-users/smm/:id/:name', auth, async (req, res) => {
  try {
    let sub = await new channelUserService().addSubscription(req.user, req.params.name, req.params.id);
    res.status(201).json(sub);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err.message);
  }
});

router.delete('/channel-users/smm/:id/:name', auth, async (req, res) => {
  try {
    let unsub = await new channelUserService().deleteSubscription(req.user, req.params.name, req.params.id);
    res.status(201).json(unsub);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err.message);
  }
});

router.post('/channels/smm/:name', auth, async (req, res) => {
  try {
    let channel = await new channelService().insertOrUpdateChannel(req.body.channel, req.user, req.params.name);
    res.status(201).json(channel);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err.message);
  }
});

router.post('/geoloc/update/smm/:name', auth, async (req, res) => {
  try {
    const geo_loc = await new squealService().updateGeoLoc(req.body, req.user, req.params.name);
    res.status(200).json(geo_loc);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err.message);
  }
});

router.get('/geoloc/get/smm/:name/:id', auth, async (req, res) => {
  try {
    const geo_loc = await new squealService().getGeoLoc(req.params.id, req.user, req.params.name);
    res.status(200).json(geo_loc);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err.message);
  }
});

router.get('/squeal-rank-comments/:name', auth, async (req, res) => {
  try {
    const ret = await new squealService().getSquealRankByComments(
      parseInt(req.query.page),
      parseInt(req.query.size),
      req.user,
      req.params.name
    );
    res.status(200).json(ret);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err.message);
  }
});

router.get('/squeal-rank-comments-inverse/:name', auth, async (req, res) => {
  try {
    const ret = await new squealService().getSquealRankByCommentsInverse(
      parseInt(req.query.page),
      parseInt(req.query.size),
      req.user,
      req.params.name
    );
    res.status(200).json(ret);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err.message);
  }
});

router.get('/squeal-rank-views/:name', auth, async (req, res) => {
  try {
    const ret = await new squealService().getSquealRankByViews(
      parseInt(req.query.page),
      parseInt(req.query.size),
      req.user,
      req.params.name
    );
    res.status(200).json(ret);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err.message);
  }
});

router.get('/squeal-rank-views-inverse/:name', auth, async (req, res) => {
  try {
    const ret = await new squealService().getSquealRankByViewsInverse(
      parseInt(req.query.page),
      parseInt(req.query.size),
      req.user,
      req.params.name
    );
    res.status(200).json(ret);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err.message);
  }
});

router.get('/squeal-rank-positive/:name', auth, async (req, res) => {
  try {
    const ret = await new squealService().getSquealRankByPositive(
      parseInt(req.query.page),
      parseInt(req.query.size),
      req.user,
      req.params.name
    );
    res.status(200).json(ret);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err.message);
  }
});

router.get('/squeal-rank-negative/:name', auth, async (req, res) => {
  try {
    const ret = await new squealService().getSquealRankByNegative(
      parseInt(req.query.page),
      parseInt(req.query.size),
      req.user,
      req.params.name
    );
    res.status(200).json(ret);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err.message);
  }
});

router.get('/squeal-rank-posneg-rateo/:name', auth, async (req, res) => {
  try {
    const ret = await new squealService().getSquealRankByPosNegRateo(
      parseInt(req.query.page),
      parseInt(req.query.size),
      req.user,
      req.params.name
    );
    res.status(200).json(ret);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err.message);
  }
});

router.get('/squeal-rank-posneg-rateo-inverse/:name', auth, async (req, res) => {
  try {
    const ret = await new squealService().getSquealRankByPosNegRateoInverse(
      parseInt(req.query.page),
      parseInt(req.query.size),
      req.user,
      req.params.name
    );
    res.status(200).json(ret);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err.message);
  }
});

router.get('/squeal-time-chart/:name/:days', auth, async (req, res) => {
  try {
    const ret = await new squealService().getSquealTimeChart(req.user, req.params.name, req.params.days);
    res.status(200).json(ret);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err.message);
  }
});

router.get('/client-chars/:name', auth, async (req, res) => {
  try {
    const ret = await new accountService().getUserChars(req.params.name);
    res.status(200).json(ret);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err.message);
  }
});

router.get('/channels/sub/get/smm/:client/:name', auth, async (req, res) => {
  try {
    const ret = await new channelService().getChannelSubscribedTo(req.user, req.params.client, req.params.name);
    res.status(200).json(ret);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err.message);
  }
});

router.post('/add-char/smm-to-client/', auth, async (req, res) => {
  try {
    const ret = await new accountService().addCharToClient(req.user, req.query.name, req.body.char);
    res.status(200).json(ret);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err.message);
  }
});

module.exports = router; // export to use in server.js
