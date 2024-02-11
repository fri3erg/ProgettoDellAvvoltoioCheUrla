const express = require('express');
const Money = require('../model/money');
const auth = require('../middleware/auth');
const MoneyService = require('../service/MoneyService');

const router = express.Router();
const moneyService = new MoneyService();

router.post('/nexi-return', auth, async (req, res) => {
  try {
    const params = req.body.params;
    if (!moneyService.isNexiMacValid(params, process.env.PAYMENT_KEY)) {
      console.error('MAC non corretto');
      return res.status(400).send('MAC non corretto, chiamata non accettata dal sistema');
    }

    const transaction = await Money.findById(params.codTrans);
    if (transaction && transaction.status !== 'START') {
      return res.status(400).send('Transaction already processed');
    }
    const updatedTransaction = await moneyService.updateTransaction(params);
    res.status(200).send({ message: 'Transaction updated successfully', data: updatedTransaction });
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

router.delete('/delete-transaction/:id', auth, async (req, res) => {
  try {
    await MoneyService.deleteTransaction(req.params.id, req.user);

    const transaction = await Money.findById(req.params.id);
    if (!transaction) {
      return res.status(404).send('Transaction not found');
    }
    if (transaction.user_id !== req.user.user_id) {
      return res.status(403).send('Unauthorized');
    }
    await Money.deleteOne({ _id: req.params.id });
    res.status(200).send('Transaction deleted successfully');
  } catch (error) {
    console.error('Error deleting transaction:', error.message);
    res.status(500).send(error.message);
  }
});

module.exports = router;
