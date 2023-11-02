const express = require('express'); //import express

const reactionService = require('../service/ReactionService');
const User = require('../model/user');
const auth = require('../middleware/auth');

// 1.
const router = express.Router();

router.post('/squeal-reaction/create', auth, async (req, res) => {
  try {
    let reaction = await new reactionService().insertOrUpdateReaction(req.body, req.user, req.user.username);
    console.log(reaction);
    res.status(201).json(reaction);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err.message);
  }
});

module.exports = router; // export to use in server.js
