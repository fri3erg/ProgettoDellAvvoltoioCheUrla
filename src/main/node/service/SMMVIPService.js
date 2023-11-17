const smmVIP = require('../model/smmVIP');
const user = require('../model/user');
const accountService = require('./AccountService');

class SMMVIPService {
  async addSMM(smmId, currentId) {
    const opt = { new: true };
    smmVIP.findOneAndUpdate({ _id: smmId }, { $push: { users: currentId } }, opt, (error, data) => {
      if (error) {
        throw new Error(error);
      }
    });
    return;
  }

  async removeSMM(smmId, currentId) {
    const opt = { new: true };
    smmVIP.findOneAndUpdate({ _id: smmId }, { $pull: { users: currentId } }, opt, (error, data) => {
      if (error) {
        throw new Error(error);
      }
    });
    return;
  }

  async getSMM(myUser, username, search) {
    let smmArray = [];
    const thisUser = await user.findOne({ login: username });
    if (!thisUser) {
      throw new Error('Invalid Username');
    }
    if (!(await new accountService().isUserAuthorized(myUser, thisUser))) {
      throw new Error('Unauthorized');
    }

    const user = await new accountService().searchUser(search);
    for (const us of user) {
      const SMMUser = await smmVIP.findOne({ user_id: us._id.toString() });
      console.log(SMMUser);
      if (SMMUser) {
        smmArray.push(us);
      }
    }
    return smmArray;
  }

  async idToObj(idArray) {
    const clientsArray = [];
    for (let i = 0; i < idArray.length; i++) {
      const client = await user.findOne({ _id: idArray[i] });
      clientsArray.push(client);
    }
    return clientsArray;
  }

  async getSMMList() {
    const vips = await smmVIP.find({});
    return vips;
  }

  async getSMMById(id) {
    const vip = await smmVIP.findOne({ _id: id });
    return vip;
  }
}
module.exports = SMMVIPService;
