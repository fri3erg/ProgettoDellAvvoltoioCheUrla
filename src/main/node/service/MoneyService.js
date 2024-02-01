const User = require('../model/user');
const Money = require('../model/money');
const crypto = require('crypto');
const config = require('../config/env');
const AdminExtras = require('../model/adminExtras');

class Parameters {
  name;
  value;
}

class PaymentUrlResponse {
  constructor() {
    this.url = '';
    this.parameters = [];
  }

  setUrl(url) {
    this.url = url;
  }

  addParameter(key, value) {
    this.parameters.push({ name: key, value: value });
  }

  getResponse() {
    return {
      url: this.url,
      parameters: this.parameters,
    };
  }
}

class MoneyService {
  constructor() {
    this.PAYMENT_URL = 'https://int-ecommerce.nexi.it/ecomm/ecomm/DispatcherServlet';
    this.PAYMENT_SET_URL = 'http://localhost:9000/transactions';
    this.PAYMENT_BACK_URL = 'http://localhost:9000';
    this.PAYMENT_KEY = process.env.PAYMENT_KEY || config.PAYMENT_KEY;
    this.PAYMENT_ALIAS = process.env.PAYMENT_ALIAS || config.PAYMENT_ALIAS;
  }

  async createMac(user, urlRequest) {
    const thisUser = await User.findOne({ _id: user.user_id });
    if (!thisUser) {
      throw new Error('Invalid user');
    }

    const pay = await Money.create({
      timestamp: new Date(),
      user_id: thisUser._id,
      n_characters: 500,
      amount: 99,
      currency: 'EUR',
      status: 'START',
    });

    const codTrans = pay._id.toString().padStart(5, '0');
    let resp = new PaymentUrlResponse();
    resp.setUrl(this.PAYMENT_URL);
    resp.addParameter('importo', pay.amount.toString());
    resp.addParameter('divisa', pay.currency);
    resp.addParameter('codTrans', codTrans);
    resp.addParameter('url', this.PAYMENT_SET_URL);
    resp.addParameter('url_back', this.PAYMENT_BACK_URL);

    const mac = `codTrans=${codTrans}divisa=${pay.currency}importo=${pay.amount}${this.PAYMENT_KEY}`;
    console.log(mac);
    resp.addParameter('mac', this.getSha1(mac));
    resp.addParameter('alias', this.PAYMENT_ALIAS);
    resp.addParameter('descrizione', `Pagamento 500 caratteri per Squealer, buon squealing ${thisUser.username}!`);

    return resp.getResponse();
  }

  getSha1(input) {
    const sha = crypto.createHash('sha1').update(input, 'utf-8').digest('hex');
    console.log(sha);
    return sha;
  }

  isNexiMacValid(params, key) {
    const rmac = params.mac;
    const cmac = `codTrans=${params.codTrans}esito=${params.esito}importo=${params.importo}divisa=${params.divisa}data=${params.data}orario=${params.orario}codAut=${params.codAut}${key}`;
    return this.getSha1(cmac) === rmac;
  }

  async updateTransaction(params) {
    const updatedTransaction = await Money.findById(params.codTrans);
    await Money.updateOne(updatedTransaction, { status: params.esito });
    const createdCharacters = await AdminExtras.create({
      user_id: updatedTransaction.user_id,
      n_characters: updatedTransaction.n_characters,
      timestamp: updatedTransaction.timestamp,
      admin_created: 'SQUEALER_NEXI',
      valid_until: updatedTransaction.timestamp + config.msinYear,
    });
    return params;
  }
}

module.exports = MoneyService;
