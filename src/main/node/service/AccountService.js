const Squeal = require('../model/squeal');
const SquealDestination = require('../model/squealDestination');
const ChannelUser = require('../model/channelUser');
const Channel = require('../model/channel');
const SquealCat = require('../model/squealCat');
const SquealReaction = require('../model/squealReaction');
const SquealViews = require('../model/squealViews');
const SMMVIP = require('../model/smmVIP');
const User = require('../model/user');

class AccountService {
  async getUsersByName(user, myUsername, search) {
    const thisUser = await User.findOne({ login: myUsername });
    if (!thisUser) {
      throw new Error('bad username');
    }

    if (!(await this.isUserAuthorized(user, thisUser))) {
      throw new Error('unauthorized');
    }
    if (search.startsWith('@')) {
      search = search.substring(1);
    }
    const users = await this.searchUser(search);
    let ret = [];
    for (const us of users) {
      ret.push(this.hideSensitive(us));
    }
    return ret;
  }

  async searchUser(search) {
    return await User.find({ login: { $regex: '(?i).*' + search + '.*' } });
  }

  async update(user, myUsername, account) {
    const thisUser = await User.findOne({ login: myUsername });
    if (!thisUser) {
      throw new Error('bad username');
    }
    if (!(await this.isUserAuthorized(user, thisUser))) {
      throw new Error('unauthorized');
    }
    if (account.first_name) {
      thisUser.first_name = account.first_name;
    }
    if (account.last_name) {
      thisUser.last_name = account.last_name;
    }
    return this.hideSensitive(await User.findOneAndUpdate({ login: thisUser.login }, thisUser));
  }

  async getUser(user, myUsername, name) {
    const thisUser = await User.findOne({ login: myUsername });
    if (!thisUser) {
      throw new Error('bad username');
    }
    if (!(await this.isUserAuthorized(user, thisUser))) {
      throw new Error('unauthorized');
    }

    if (name.startsWith('@')) {
      name = name.substring(1);
    }
    return this.hideSensitive(await User.findOne({ login: name }));
  }

  //not tested
  async addVip(user, myUsername) {
    const thisUser = await User.findOne({ login: myUsername });
    if (!thisUser) {
      throw new Error('bad username');
    }
    if (!(await this.isUserAuthorized(user, thisUser))) {
      throw new Error('unauthorized');
    }
    if (this.isUserVip(thisUser)) {
      throw new Error('you already have that role');
    }
    const auth = thisUser.authorities.push('ROLE_VIP');
    return this.hideSensitive(await User.findOneAndUpdate({ login: thisUser.login }, { authorities: auth }));
  }

  async imgUpdate(user, myUsername, account) {
    const thisUser = await User.findOne({ login: myUsername });
    if (!thisUser) {
      throw new Error('bad username');
    }
    if (!(await this.isUserAuthorized(user, thisUser))) {
      throw new Error('unauthorized');
    }
    await User.findOneAndUpdate(
      { login: thisUser.login },
      { img: this.resizeUserImg(account.img), img_content_type: account.img_content_type }
    );
    const updated = this.hideSensitive(await User.findOne({ login: myUsername }));
    console.log(updated.img);
    return updated;
  }

  hideSensitive(account) {
    if (!account) {
      throw new Error('account not found');
    }
    return {
      login: account.login,
      _id: account._id,
      first_name: account.first_name,
      last_name: account.last_name,
      img: account.img,
      email: account.email,
      imgContentType: account.imgContentType,
      authorities: account.authorities,
      lang_key: account.lang_key,
    };
  }

  async isMod(user) {
    if (!user) {
      throw new Error('invalid user');
    }
    if (!user.authorities) {
      user = await User.findById(user.user_id);
    }
    if (user.authorities.includes('ROLE_MOD')) {
      return true;
    }
    return false;
  }

  async isUserVip(user) {
    if (!user) {
      throw new Error('invalid user');
    }
    if (!user.authorities) {
      user = await User.findOne({ login: user.user_id });
    }
    if (user.authorities.includes('ROLE_VIP')) {
      return true;
    }
    return false;
  }

  resizeUserImg(img) {
    //TODO:implement
    return img;
  }

  async isUserAuthorized(myUser, theirUser) {
    if (!myUser || !theirUser) {
      throw new Error('invalid username');
    }
    if (await this.isMod(myUser)) {
      return true;
    }
    return myUser.user_id.toString() == theirUser._id.toString() || this.isUserClient(theirUser, myUser);
  }

  async isUserClient(client, user) {
    const smmUser = await SMMVIP.findOne({ user_id: user.user_id });
    if (!smmUser.users) {
      throw new Error('you dont have any clients');
    }
    for (const user of smmUser.users) {
      if (client._id.toString() === user) {
        return true;
      }
    }
    return false;
  }
}
module.exports = AccountService;
