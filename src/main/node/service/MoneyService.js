const User = require('../model/user');
const Money = require('../model/money');
const crypto = require('crypto');
const config = require('../config/env');

class PaymentUrlResponse {
  constructor() {
    this.url = '';
    this.parameters = {};
  }

  setUrl(url) {
    this.url = url;
  }

  addParameter(key, value) {
    this.parameters[key] = value;
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
    this.PAYMENT_SET_URL = 'https://www.yourdomain.com/payment/set';
    this.PAYMENT_BACK_URL = 'https://www.yourdomain.com/payment/back';
    this.PAYMENT_KEY = process.env.PAYMENT_KEY || config.PAYMENT_KEY;
  }

  async createMac(user, urlRequest) {
    const thisUser = await User.findOne({ _id: user._id });
    if (!thisUser) {
      throw new Error('Invalid user');
    }

    const pay = await Money.create({
      timestamp: new Date(),
      user_id: thisUser._id,
      n_characters: 500,
      amount: 0.99,
      currency: 'EUR',
      status: 'KO',
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
    resp.addParameter('mac', this.getSha1(mac));
    resp.addParameter('descrizione', `Pagamento abbonamento: ${urlRequest.cardNumber}`);
    resp.addParameter('cardNumber', urlRequest.cardNumber);

    return resp.getResponse();
  }

  getSha1(input) {
    return crypto.createHash('sha1').update(input, 'utf-8').digest('hex');
  }

  isNexiMacValid(request, key) {
    const rmac = request.body.mac;
    const cmac = `codTrans=${request.body.codTrans}esito=${request.body.esito}importo=${request.body.importo}divisa=${request.body.divisa}data=${request.body.data}orario=${request.body.orario}codAut=${request.body.codAut}${key}`;
    return this.getSha1(cmac) === rmac;
  }

  async processTransaction(data) {
    const status = this.getStatus(data.esito);
    const updatedTransaction = await Money.updateOne({ codTrans: data.codTrans }, { status: status }, { new: true });
    return updatedTransaction;
  }

  getStatus(esito) {
    switch (esito.toUpperCase()) {
      case 'ANNULLO':
        return 'PAGAMENTO_ANNULLO';
      case 'KO':
        return 'PAGAMENTO_KO';
      case 'ERRORE':
        return 'PAGAMENTO_ERRORE';
      case 'OK':
        return 'PAGAMENTO_OK';
      default:
        throw new Error(`Esito: ${esito} non è un esito valido`);
    }
  }
}

module.exports = MoneyService;
