const Squeal = require('../model/squeal');
const SquealDestination = require('../model/squealDestination');
const ChannelUser = require('../model/channelUser');
const Channel = require('../model/channel');
const SquealCat = require('../model/squealCat');
const SquealReaction = require('../model/squealReaction');
const SquealViews = require('../model/squealViews');
const User = require('../model/user');

class AccountService {
  async getUsersByName(user, myUsername, search) {
    if (!this.isUserAuthorized(myUsername, user.username)) {
      throw new Error('unauthorized');
    }
    const myUser = await User.findOne({ login: myUsername });
    if (!myUser) {
      throw new Error('bad username');
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
  isUserAuthorized(id, currentUserId) {
    return id.toString() == currentUserId.toString();
  }

  async getUser(user, myUsername, name) {
    if (!this.isUserAuthorized(myUsername, user.username)) {
      throw new Error('unauthorized');
    }
    const myUser = await User.findOne({ login: myUsername });
    if (!myUser) {
      throw new Error('bad username');
    }

    if (name.startsWith('@')) {
      name = name.substring(1);
    }
    return this.hideSensitive(await User.findOne({ login: name }));
  }

  async imgUpdate(user, myUsername, account) {
    if (!this.isUserAuthorized(myUsername, user.username)) {
      throw new Error('unauthorized');
    }
    const myUser = await User.findOne({ login: myUsername });
    if (!myUser) {
      throw new Error('bad username');
    }
    await User.findOneAndUpdate({ login: myUser.login }, { img: resizeUserImg(account.img), img_content_type: account.img_content_type });
    const updated = this.hideSensitive(await User.findOne({ login: myUsername }));
    console.log(updated.img);
    return updated;
  }

  hideSensitive(account) {
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

  isUserAuthorized(id, currentUserId) {
    if (!id || !currentUserId) {
      throw new Error('invalid username');
    }
    return id.toString() == currentUserId.toString();
  }
}

module.exports = AccountService;
