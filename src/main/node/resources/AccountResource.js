const express = require('express'); //import express
const { v1: uuidv1, v4: uuidv4 } = require('uuid');
const accountService = require('../service/AccountService');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../model/user');
const SmmVIP = require('../model/smmVIP');
const auth = require('../middleware/auth');
const config = require('../config/env.js');

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
      const token = jwt.sign({ user_id: user._id, username }, config.TOKEN_KEY, {
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

router.post('/authenticate/smm', async (req, res) => {
  try {
    // Get user input
    const { username, password } = req.body;

    // Validate user input
    if (!(username && password)) {
      res.status(400).send('All input is required');
    }

    // Validate if user exist in our database
    const user = await User.findOne({ login: username });
    console.log(user);

    if (!user.authorities) {
      return res.status(401).send('Non hai i permessi');
    } else {
      authArray = ['ROLE_ADMIN', 'ROLE_VIP', 'ROLE_SMM'];
      const result = user.authorities.map(authority => authArray.includes(authority)).find(value => value === true);

      if (!result) {
        res.status(401).send('Non hai i permessi');
      } else {
        if (user && (await bcrypt.compare(password, user.password))) {
          // Create token
          const token = jwt.sign({ user_id: user._id, username }, config.TOKEN_KEY, {
            expiresIn: '200h',
          });

          res.setHeader('Authorization', 'Bearer ' + token);

          const t = {
            id_token: token,
          };
          res.status(200).json(t);
          return;
        }
      }
    }
    res.status(400).send('Invalid Credentials');
  } catch (err) {
    console.log(err);
  }
});

router.get('/user-by-name', auth, async (req, res) => {
  try {
    const ret = await new accountService().getUser(req.user, req.user.username, req.query.name);
    if (!ret) {
      throw new Error('invalid username');
    }
    res.status(200).json(ret);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err.message);
  }
});

router.get('/add-vip', auth, async (req, res) => {
  try {
    const ret = await new accountService().addVip(req.user, req.user.username);
    if (!ret) {
      throw new Error('operation unsuccessful');
    }
    res.status(200).json(ret);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err.message);
  }
});

router.get('/account', auth, async (req, res) => {
  try {
    const cUsername = req.user.username;
    let user = await User.findOne({ login: cUsername });
    if (!user) {
      res.status(404).send('user not found');
    }

    //Rifare il account authorities
    const auth = user.authorities;
    const authNew = [];
    for (let i = 0; i < auth.length; i++) {
      authNew.push(auth[i]);
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

router.get('/users/search', auth, async (req, res) => {
  try {
    const ret = await new accountService().getUsersByName(req.user, req.user.username, req.query.search);

    return res.status(200).json(ret);
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
});

router.get('/users/search-filtered', auth, async (req, res) => {
  try {
    const ret = await new accountService().getUsersByName(
      req.user,
      req.user.username,
      req.query.search,
      req.query.byRole,
      req.query.byPopolarity
    );

    return res.status(200).json(ret);
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
});

router.post('/users/block/', auth, async (req, res) => {
  try {
    const ret = await new accountService().block(req.user, req.query.username, req.query.block);

    res.status(200).json(ret);
    return;
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
});

router.post('/account/img-update', auth, async (req, res) => {
  try {
    const account = req.body;

    if (!account || !account.img) {
      throw new Error('invalid account');
    }

    const ret = await new accountService().imgUpdate(req.user, req.user.username, account);
    if (account.img != ret.img) {
      console.log('test');
    }

    res.status(200).json(ret);
    return;
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
});

router.post('/account/admin-extra', auth, async (req, res) => {
  try {
    const ret = await new accountService().addAdminExtra(req.user, req.body.admin_extra);

    res.status(200).json(ret);
    return;
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
});

router.get('/account/list-users', auth, async (req, res) => {
  try {
    const ret = await new accountService().listUsers(req.user, parseInt(req.query.page), parseInt(req.query.size));

    res.status(200).json(ret);
    return;
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
});

router.delete('/account/:id', auth, async (req, res) => {
  try {
    const ret = await new accountService().delete(req.user, req.params.id);

    res.status(200).json(ret);
    return;
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
});

router.post('/register', async (req, res) => {
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
      login,
      email: email.toLowerCase(), // sanitize: convert email to lowercase
      password: encryptedPassword,
      timestamp: new Date.now(),
      activation_key: uuidv4(),
      authorities: ['ROLE_USER'],
      activated: true,
    });

    // Create token
    const token = jwt.sign({ user_id: user._id, email }, config.TOKEN_KEY, {
      expiresIn: '2h',
    });

    res.setHeader('Authorization', 'Bearer ' + token);

    // save user token
    user.token = token;
    //sendActivationMail();

    // return new user
    res.status(201).json(user);
    return;
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
      login,
      email: email.toLowerCase(), // sanitize: convert email to lowercase
      password: encryptedPassword,
      activation_key: uuidv4(),
      timestamp: new Date.now(),
      authorities: ['ROLE_USER', 'ROLE_SMM', 'ROLE_VIP'],
    });

    // Create token
    const token = jwt.sign({ user_id: user._id, email }, config.TOKEN_KEY, {
      expiresIn: '2h',
    });

    res.setHeader('Authorization', 'Bearer ' + token);

    // save user token
    user.token = token;
    //sendActivationMail();

    // Create userVIP in our database
    const smmVIP = await SmmVIP.create({
      user_id: user._id.toString(),
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
router.post('/account/update', auth, async (req, res) => {
  try {
    const account = req.body;

    if (!account) {
      throw new Error('invalid account');
    }

    const ret = await new accountService().update(req.user, req.user.username, account);

    res.status(200).json(ret);
    return;
  } catch (err) {}
});

router.post('/register/vip', async (req, res) => {
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
      login,
      email: email.toLowerCase(), // sanitize: convert email to lowercase
      password: encryptedPassword,
      timestamp: new Date.now(),
      activation_key: uuidv4(),
      authorities: ['ROLE_USER', 'ROLE_VIP'],
    });

    // Create token
    const token = jwt.sign({ user_id: user._id, email }, config.TOKEN_KEY, {
      expiresIn: '2h',
    });

    res.setHeader('Authorization', 'Bearer ' + token);

    // save user token
    user.token = token;
    //sendActivationMail();

    // Create userVIP in our database
    const userVIP = await SmmVIP.create({
      user_id: user._id.toString(),
      users: [user._id.toString()],
    });

    // return new user
    res.status(201).json(user);
    return;
  } catch (err) {
    console.log(err);
  }
});

router.post('/authenticate/admin', async (req, res) => {
  try {
    // Get user input
    const { username, password } = req.body;

    // Validate user input
    if (!(username && password)) {
      res.status(400).send('All input is required');
    }

    // Validate if user exist in our database
    const user = await User.findOne({ login: username });
    console.log(user);

    if (!user.authorities) {
      return res.status(401).send('Non hai i permessi');
    } else {
      authArray = ['ROLE_ADMIN'];
      const result = user.authorities.map(authority => authArray.includes(authority)).find(value => value === true);

      if (!result) {
        res.status(401).send('Non hai i permessi');
      } else {
        if (user && (await bcrypt.compare(password, user.password))) {
          // Create token
          const token = jwt.sign({ user_id: user._id, username }, config.TOKEN_KEY, {
            expiresIn: '2h',
          });

          res.setHeader('Authorization', 'Bearer ' + token);

          const t = {
            id_token: token,
          };
          res.status(200).json(t);
          return;
        }
      }
    }
    res.status(400).send('Invalid Credentials');
  } catch (err) {
    console.log(err);
  }
});

router.post('/register/admin', async (req, res) => {
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
      login,
      email: email.toLowerCase(), // sanitize: convert email to lowercase
      password: encryptedPassword,
      activation_key: uuidv4(),
      timestamp: new Date.now(),
      authorities: ['ROLE_USER', 'ROLE_SMM', 'ROLE_VIP', 'ROLE_ADMIN'],
    });

    // Create token
    const token = jwt.sign({ user_id: user._id, email }, config.TOKEN_KEY, {
      expiresIn: '2h',
    });

    res.setHeader('Authorization', 'Bearer ' + token);

    // save user token
    user.token = token;
    //sendActivationMail();

    // Create userVIP in our database
    // return new user
    res.status(201).json(user);
    return;
  } catch (err) {
    console.log(err);
  }
});

module.exports = router; // export to use in server.js
