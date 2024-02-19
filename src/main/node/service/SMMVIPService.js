const channelUser = require('../model/channelUser');
const smmVIP = require('../model/smmVIP');
const user = require('../model/user');
const accountService = require('./AccountService');

class SMMVIPService {
  //da testare
  async addSMM(smmId, currentId) {
    const isClient = await smmVIP.findOne({ users: currentId });

    if (!isClient) {
      throw new Error('You already have a SMM');
    }
    const opt = { new: true };
    await smmVIP.findOneAndUpdate({ _id: smmId }, { $push: { users: currentId } }, opt, (error, data) => {
      if (error) {
        throw new Error(error);
      }
    });
    return 'added';
  }

  async addClient(username, userLogin) {
    try {
      const client = await user.findOne({ login: userLogin });
      const isClient = await smmVIP.findOne({ users: { $elemMatch: { $eq: client._id } } });
      const thisUser = await user.findOne({ login: username });
  
      if (isClient) {
        throw new Error('User already has a SMM');
      }
  
      if (!thisUser || !thisUser.authorities || !Array.isArray(thisUser.authorities)) {
        throw new Error('Invalid user or missing authorities');
      }
  
      const hasPermission = ['ROLE_ADMIN', 'ROLE_SMM'].some(role => thisUser.authorities.includes(role));
      if (!hasPermission) {
        throw new Error('User does not have the required permissions');
      }
  
      const opt = { new: true };
      await smmVIP.findOneAndUpdate({ user_id: thisUser._id }, { $push: { users: client._id } }, opt);
      
      return 'added';
    } catch (error) {
      throw new Error(error.message);
    }
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
    const smm = await user.find({
      login: { $regex: search, $options: 'i' },
      authorities: { $in: ['ROLE_SMM'] },
    });

    for (const user of smm) {
      smmArray.push(await new accountService().hideSensitive(user));
    }

    return smmArray;
  }

  async idToObj(idArray) {
    const clientsArray = [];
    for (let i = 0; i < idArray.length; i++) {
      const client = await user.findById(idArray[i]);
      const client_protected = await new accountService().hideSensitive(client);
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
