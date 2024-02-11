const SMMVIP = require('../model/smmVIP');
const User = require('../model/user');
const AdminExtra = require('../model/adminExtras');
const SquealCat = require('../model/squealCat');
const squeal = require('../model/squeal');
const SquealService = require('./SquealService');

class AccountService {
  async getUsersByName(user, myUsername, search, byRole, byPopolarity) {
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
    let users = [];
    if (byRole) {
      users = await User.find({ authorities: byRole });
    }
    if (byPopolarity) {
      const result = await SquealCat.aggregate([
        {
          $group: {
            _id: '$user_id',
            totalCharacters: { $sum: '$n_characters' },
          },
        },
        { $sort: { totalCharacters: -1 } },
        { $limit: 5 },
      ]);
      for (const res of result) {
        users.push(await User.findById(res._id));
      }
    }
    if (!byRole && !byPopolarity) {
      users = await this.searchUser(search);
    }
    let ret = [];
    for (const us of users) {
      ret.push(this.hideSensitive(us));
    }
    return ret;
  }

  async block(user, hisUsername, block) {
    const thisUser = await User.findOne({ login: user.username });
    if (!thisUser) {
      throw new Error('bad username');
    }

    if (!(await this.isMod(thisUser))) {
      throw new Error('unauthorized');
    }
    const ret = await User.findOneAndUpdate({ login: hisUsername }, { activated: block });
    return this.hideSensitive(ret);
  }

  async getUserImg(id) {
    const user = await User.findById(id);
    return user.img;
  }
  async getUserImgContentType(id) {
    const user = await User.findById(id);
    return user.img_content_type;
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

  //not tested
  async addAdminExtra(user, adminExtra) {
    const thisUser = await User.findOne({ login: user.username });
    if (!thisUser) {
      throw new Error('bad username');
    }
    if (!(await this.isMod(thisUser))) {
      throw new Error('unauthorized');
    }
    const admin_extra = await adminExtra.create({
      n_characters: adminExtra.n_characters,
      user_id: adminExtra.user_id,
      timestamp: adminExtra.timestamp,
      admin_created: thisUser.login,
    });
    return admin_extra;
  }

  async delete(user, user_id) {
    const thisUser = await User.findOne({ login: user.username });
    const userToDelete = await User.findById(user_id);
    if (!thisUser || !userToDelete) {
      throw new Error('bad username');
    }
    if (!(await this.isUserAuthorized(userToDelete, thisUser))) {
      throw new Error('unauthorized');
    }

    const deleted = await User.findOneAndDelete({ login: userToDelete.login });
    const squeals = await squeal.find({ user_id: userToDelete._id });
    for (const squeal of squeals) {
      await new SquealService.delete();
    }
    const smmVIP = await SMMVIP.deleteMany({ user_id: userToDelete._id });
    const adminExtra = await AdminExtra.deleteMany({ user_id: userToDelete._id });
    const notifications = await Notification.deleteMany({ user_id: userToDelete._id });
    const channelUser = await ChannelUser.deleteMany({ user_id: userToDelete._id });
    const smmUser = await SMMVIP.find({ users: userToDelete._id });
    for (const user of smmUser) {
      user.users = user.users.filter(e => e !== userToDelete._id);
      await SMMVIP.findOneAndUpdate({ user_id: user.user_id }, user);
    }

    return deleted;
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
    if (user.authorities.includes('ROLE_ADMIN')) {
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
    if (myUser.user_id.toString() == theirUser._id.toString() || this.isUserClient(theirUser, myUser)) {
      return true;
    }
    if (myUser._id.toString() == theirUser.user_id.toString() || this.isUserClient(myUser, theirUser)) {
      return true;
    }
    if (myUser._id.toString() == theirUser._id.toString()) {
      return true;
    }
    return false;
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

  async listUsers(user, page, size) {
    const thisUser = await User.findOne({ login: user.username });
    if (!thisUser) {
      throw new Error('bad username');
    }
    if (!(await this.isMod(thisUser))) {
      throw new Error('unauthorized');
    }
    return await User.find()
      .limit(size)
      .skip(size * page);
  }
}
module.exports = AccountService;
