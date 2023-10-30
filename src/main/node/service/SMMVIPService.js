const smmVIP = require('../model/smmVIP');

class SMMVIPService {
  async addSMM(smmId, currentId) {
    const opt = { new: true };
    smmVIP.findOneAndUpdate({ _id: smmId }, { $push: { users: currentId } }, opt, (error, data) => {
      if (error) {
        console.log(error);
      } else {
        console.log(data);
      }
    });
    return;
  }
}

module.exports = SMMVIPService;