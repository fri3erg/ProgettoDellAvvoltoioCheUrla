const channelUser = require('../model/channelUser');
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

  async getTotalPosReaction(myUser) {
    const userName = myUser.username;
    const thisUser = await user.findOne({ login: userName });

    if (!thisUser.authorities) {
      return res.status(401).send('Non hai i permessi');
    } else {
      authArray = ['ROLE_ADMIN', 'ROLE_SMM', 'ROLE_VIP'];
      const result = thisUser.authorities.map(authority => authArray.includes(authority)).find(value => value === true);

      if (!result) {
        res.status(401).send('Non hai i permessi');
      } else {
        //!
      }
    }
  }

  async iAmSubbed(myUser, username, channelId) {
    const thisUser = await user.findOne({ login: username });
    if (!thisUser) {
      throw new Error('Invalid Username');
    }
    if (!(await new accountService().isUserAuthorized(myUser, thisUser))) {
      throw new Error('Unauthorized');
    }

    const subbed = await channelUser.findOne({ channel_id: channelId, user_id: thisUser._id });
    if (subbed) {
      return true;
    } else {
      return false;
    }
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
    const accountService = new accountService();
    const smm = await smmVIP.find({ name: { $regex: search, $options: 'i' } });

    smm.forEach(sm => {
      idArray.push(sm.user_id);
    });

    const users_associated = await user.find({ login: { $in: idArray } });

    users_associated.forEach(user => {
      smmArray.push(accountService.hideSensitive(user));
    });

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
