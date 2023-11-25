const smmVIP = require('../model/smmVIP');
const user = require('../model/user');
const accountService = require('./AccountService');

class SMMVIPService {
  //da testare
  async addSMM(smmId, currentId) {
    const isClient = smmVIP.findOne({ users: currentId });

    if (!isClient) {
      throw new Error('You already have a SMM');
    }
    const opt = { new: true };
    smmVIP.findOneAndUpdate({ _id: smmId }, { $push: { users: currentId } }, opt, (error, data) => {
      if (error) {
        throw new Error(error);
      }
    });
    return 'added';
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

    const users = await new accountService().searchUser(search);
    for (const us of users) {
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
      const client = await user.findById(idArray[i]);
      const client_protected = new accountService().hideSensitive(client);
      clientsArray.push(client_protected);
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
