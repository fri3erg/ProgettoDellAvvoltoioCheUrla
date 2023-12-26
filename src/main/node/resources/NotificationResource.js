const express = require('express'); //import express

const notificationService = require('../service/NotificationService');
const auth = require('../middleware/auth');

// 1.
const router = express.Router();
router.get('/notification/', auth, async (req, res) => {
  try {
    let n = await new notificationService().getNotification(
      parseInt(req.query.page),
      parseInt(req.query.size),
      req.user,
      req.user.username
    );
    console.log(n);
    res.status(201).json(n);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err.message);
  }
});

router.get('/notification/smm/:name', auth, async (req, res) => {
  try {
    let n = await new notificationService().getNotification(parseInt(req.query.page), parseInt(req.query.size), req.user, req.params.name);
    console.log(n);
    res.status(201).json(n);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err.message);
  }
});
//TODO: make it smm accessible
router.get('/notification/notread/:name', auth, async (req, res) => {
  try {
    let n = await new notificationService().getNotReadNotification(req.params.name);
    res.status(201).json(n);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err.message);
  }
});

router.get('/notification/direct/:direct', auth, async (req, res) => {
  try {
    let n = await new notificationService().getDirectNotification(req.user, req.user.username, req.params.direct);
    res.status(201).json(n);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err.message);
  }
});

router.get('/notification/directsetread/:direct', auth, async (req, res) => {
  try {
    let n = await new notificationService().setReadDirect(req.user, req.user.username, req.params.direct);
    res.status(201).json(n);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err.message);
  }
});

module.exports = router; // export to use in server.js
