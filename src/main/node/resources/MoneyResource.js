const express = require('express');
const Money = require('../model/money');
const auth = require('../middleware/auth');
const MoneyService = require('../service/MoneyService');

const router = express.Router();
const moneyService = new MoneyService();

router.post('/nexi-return', auth, async (req, res) => {
  try {
    if (!moneyService.isNexiMacValid(req, process.env.PAYMENT_KEY)) {
      console.error('MAC non corretto');
      return res.status(400).send('MAC non corretto, chiamata non accettata dal sistema');
    }

    const transaction = await Money.findOne({ codTrans: req.body.codTrans });
    if (transaction && transaction.status === 'OK') {
      return res.status(400).send('Transaction already processed');
    }

    const updatedTransaction = await moneyService.processTransaction(req.body);
    res.send({ message: 'Transaction updated successfully', data: updatedTransaction });
  } catch (error) {
    console.error('Error processing Nexi return:', error.message);
    res.status(500).send(error.message);
  }
});

router.post('/nexi-start', auth, async (req, res) => {
  try {
    const user = req.user; // Assuming `req.user` is set by your auth middleware
    const response = await moneyService.createMac(user, req.body);
    res.send(response);
  } catch (error) {
    console.error('Error starting Nexi transaction:', error.message);
    res.status(500).send(error.message);
  }
});

module.exports = router;
