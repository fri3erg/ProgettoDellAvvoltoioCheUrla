const smmVIP = require('../model/smmVIP');
const user = require('../model/user');

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

  async removeSMM(smmId, currentId) {
    const opt = { new: true };
    smmVIP.findOneAndUpdate({ _id: smmId }, { $pull: { users: currentId } }, opt, (error, data) => {
      if (error) {
        console.log(error);
      } else {
        console.log(data);
      }
    });
    return;
  }

  async idToObj(idArray) {
    const clientsArray = [];
    for (let i = 0; i < idArray.length; i++) {
      const client = await user.findOne({ _id: idArray[i] });
      clientsArray.push(client);
    }
    return clientsArray;
  }
}

module.exports = SMMVIPService;
