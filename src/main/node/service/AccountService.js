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

    if (!this.isUserAuthorized(user, thisUser)) {
      throw new Error('unauthorized');
    }
    if (search.startsWith('@')) {
      search = search.substring(1);
    }
    const users = await User.find({ login: { $regex: '(?i).*' + search + '.*' } });
    let ret = [];
    for (const us of users) {
      ret.push(this.hideSensitive(us));
    }
    return ret;
  }

  async getUser(user, myUsername, name) {
    const thisUser = await User.findOne({ login: myUsername });
    if (!thisUser) {
      throw new Error('bad username');
    }
    if (!this.isUserAuthorized(user, thisUser)) {
      throw new Error('unauthorized');
    }

    if (name.startsWith('@')) {
      name = name.substring(1);
    }
    return this.hideSensitive(await User.findOne({ login: name }));
  }

  async imgUpdate(user, myUsername, account) {
    const thisUser = await User.findOne({ login: myUsername });
    if (!thisUser) {
      throw new Error('bad username');
    }
    if (!this.isUserAuthorized(user, thisUser)) {
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
      img: account.img,
      imgContentType: account.imgContentType,
      authorities: account.authorities,
      lang_key: account.lang_key,
    };
  }

  isMod(user) {
    for (const a of user.authorities) {
      if (a === 'ROLE_ADMIN') {
        return true;
      }
    }
    return false;
  }

  resizeUserImg(img) {
    //TODO:implement
    return img;
  }

  isUserAuthorized(myUser, theirUser) {
    if (!myUser || !theirUser) {
      throw new Error('invalid username');
    }
    return myUser.user_id.toString() == theirUser._id.toString() || this.isUserClient(myUser, theirUser);
  }

  async isUserClient(myUser, theirUser) {
    const smmVip = await SMMVIP.findById(myUser._id.toString());
    if (!smmVip) {
      return false;
    }
    for (const user of smmVip.users) {
      if (theirUser.login === user) {
        return true;
      }
    }
    return false;
  }
  isUserVip(user) {
    for (const a of user.authorities) {
      if (a === 'ROLE_VIP') {
        return true;
      }
    }
    return false;
  }
}

module.exports = AccountService;
