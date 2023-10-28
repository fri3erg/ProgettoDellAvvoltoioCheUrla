const express = require('express'); //import express
require('dotenv').config();
require('../config/database');
const mongoose = require('mongoose');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../model/user');
const SmmVIP = require('../model/smmVIP');
const auth = require('../middleware/auth');
const verifyAuth = require('../middleware/verifyAuth');

// 1.
const router = express.Router();

router.post('/authenticate', async (req, res) => {
  try {
    // Get user input
    const { username, password } = req.body;

    // Validate user input
    if (!(username && password)) {
      res.status(400).send('All input is required');
    }

    // Validate if user exist in our database
    const user = await User.findOne({ login: username });

    if (user && (await bcrypt.compare(password, user.password))) {
      // Create token
      const token = jwt.sign({ user_id: user._id, username }, process.env.TOKEN_KEY, {
        expiresIn: '200h',
      });

      res.setHeader('Authorization', 'Bearer ' + token);

      const t = {
        id_token: token,
      };
      res.status(200).json(t);
      return;
    }
    res.status(400).send('Invalid Credentials');
  } catch (err) {
    console.log(err);
  }
});

router.get('/account', auth, async (req, res) => {
  try {
    const cId = req.user.user_id;
    let user = await User.findOne({ _id: cId });
    if (!user) {
      res.status(404).send('user not found');
    }

    //Rifare il account authorities
    const auth = user.authorities;
    const authNew = [];
    for (let i = 0; i < auth.length; i++) {
      authNew.push(auth[i]._id);
      // user.authorities.push(auth[i]._id);
    }

    console.log(authNew);

    user.authorities = authNew;

    console.log(user);
    res.status(200).json(user);
    return;
  } catch (err) {
    console.log(err);
  }
});

router.post('/register', async (req, res) => {
  try {
    // Get user input
    const { first_name, last_name, email, password } = req.body;

    // Validate user input
    if (!(email && password && first_name && last_name)) {
      res.status(400).send('All input is required');
    }

    // Check if user already exist
    let oldUser = await User.findOne({ email });
    if (oldUser) {
      return res.status(409).send('User Already Exist. Please Login');
    }

    oldUser = await User.findOne({ first_name });
    if (oldUser) {
      return res.status(409).send('User Already Exist. Please Login');
    }

    if (password.length < 4 || password.length > 100) {
      return res.status(409).send('password of invalid length');
    }

    //Encrypt user password
    const encryptedPassword = await bcrypt.hash(password, 10);

    // Create user in our database
    const user = await User.create({
      first_name,
      last_name,
      email: email.toLowerCase(), // sanitize: convert email to lowercase
      password: encryptedPassword,
      authorities: [
        {
          _id: 'ROLE_USER',
        },
      ],
    });

    // Create token
    const token = jwt.sign({ user_id: user._id, email }, process.env.TOKEN_KEY, {
      expiresIn: '2h',
    });
    // save user token
    user.token = token;
    //sendActivationMail();

    // return new user
    res.status(201).json(user);
  } catch (err) {
    console.log(err);
  }
});

router.post('/register/smm', async (req, res) => {
  try {
    // Get user input
    const { email, login, password } = req.body;

    // Validate user input
    if (!(email && password && login)) {
      res.status(400).send('All input is required');
    }

    // Check if user already exist
    let oldUser = await User.findOne({ email });
    if (oldUser) {
      return res.status(409).send('User Already Exist. Please Login');
    }

    if (password.length < 4 || password.length > 100) {
      return res.status(409).send('password of invalid length');
    }

    //Encrypt user password
    const encryptedPassword = await bcrypt.hash(password, 10);

    // Create user in our database
    const user = await User.create({
      login: login,
      email: email.toLowerCase(), // sanitize: convert email to lowercase
      password: encryptedPassword,
      authorities: [
        {
          _id: 'ROLE_USER',
        },
        {
          _id: 'ROLE_SMM',
        },
      ],
    });

    // Create token
    const token = jwt.sign({ user_id: user._id, email }, process.env.TOKEN_KEY, {
      expiresIn: '2h',
    });

    res.setHeader('Authorization', 'Bearer ' + token);

    // save user token
    user.token = token;
    //sendActivationMail();

    // Create userVIP in our database
    const smmVIP = await SmmVIP.create({
      user_id: user._id,
      $set: {
        users: [],
      },
    });

    // return new user
    res.status(201).json(user);
    return;
  } catch (err) {
    console.log(err);
  }
});

module.exports = router; // export to use in server.js
