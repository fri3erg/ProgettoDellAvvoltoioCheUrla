const Squeal = require('../model/squeal');
const SquealDestination = require('../model/squealDestination');
const ChannelUser = require('../model/channelUser');
const Channel = require('../model/channel');
const SquealCat = require('../model/squealCat');
const SquealReaction = require('../model/squealReaction');
const SquealViews = require('../model/squealViews');
const User = require('../model/user');
const { isModuleNamespaceObject } = require('util/types');

class ChannelService {
  async getChannel(user, myUsername, id) {
    let ret = {};
    if (!this.isUserAuthorized(myUsername, user.username)) {
      throw new Error('Unathorized');
    }
    const myUser = await User.findOne({ login: myUsername });
    if (!myUser) {
      throw new Error('username invalid');
    }
    let channel = await Channel.findById(id);
    switch (channel.type) {
      case 'PRIVATEGROUP':
        if (await this.checkSubscribed(channel, myUser)) {
          ret = await this.loadChannelData(channel);
        }
        break;
      case 'PUBLICGROUP':
      case 'MOD':
        ret = await this.loadChannelData(channel);
        break;
      default:
        break;
    }
    return ret;
  }

  async searchChannel(user, myUsername, search) {
    const ret = [];
    if (!this.isUserAuthorized(myUsername, user.username)) {
      throw new Error('Unathorized');
    }

    const myUser = await User.findOne({ login: myUsername });
    if (!myUser) {
      throw new Error('invalid username');
    }
    let channels = await Channel.find({ name: { $regex: '(?i).*' + search + '.*' } });

    for (const ch of channels) {
      switch (ch.type) {
        case 'PRIVATEGROUP':
          if (await this.checkSubscribed(ch, myUser)) {
            ret.push(await this.loadChannelData(ch));
          }
          break;
        case 'PUBLICGROUP':
        case 'MOD':
          ret.push(await this.loadChannelData(ch));
          break;
        default:
          break;
      }
    }
    return ret;
  }

  async insertOrUpdateChannel(channel, user, username) {
    let ret = {};
    const thisUser = await User.findOne({ login: username });
    if (!channel || !thisUser) {
      throw new Error('invalid data');
    }
    if (!this.isUserAuthorized(thisUser._id, user.user_id)) {
      throw new Error('Not authorized');
    }
    if (this.isIncorrectName(channel.name)) {
      throw new Error('Name Invalid');
    }
    if (!channel.name || !channel.type) {
      throw new Error('Incomplete');
    }
    if (channel.type == 'MOD' && !this.isMod(thisUser)) {
      throw new Error('You do not have permission');
    }

    channel.name = this.addPrefix(channel);

    const oldChannel = await Channel.findOne({ name: channel.name });
    if (oldChannel) {
      const userSub = await ChannelUser.findOne({ channel_id: oldChannel._id.toString(), user_id: thisUser._id.toString() });
      if (userSub) {
        throw new Error('You can only have one channel with this name');
      }
    }
    let newChannel = new Channel({
      name: channel.name,
      type: channel.type,
    });

    newChannel = await newChannel.save();
    await ChannelUser.create({
      channel_id: newChannel._id.toString(),
      user_id: thisUser._id.toString(),
      privilege: 'ADMIN',
    });

    const dto = await this.loadChannelData(newChannel);

    if (dto) {
      ret = newChannel;
    }

    return ret;
  }

  async getPeopleFollowing(user, myUsername, id) {
    if (!this.isUserAuthorized(myUsername, user.username)) {
      throw new Error('Unathorized');
    }

    const myUser = await User.findOne({ login: myUsername });
    if (!myUser) {
      throw new Error('invalid username');
    }
    const ch = await Channel.findById(id);
    if (ch.type == 'PRIVATEGROUP') {
      if (!(await ChannelUser.find({ user_id: myUser._id.toString(), channel_id: id }))) {
        throw new Error('Unauthorized');
      }
    }

    const chUs = await ChannelUser.find({ channel_id: id });
    const chId = [];
    for (const c of chUs) {
      chId.push(c.user_id);
    }
    let ret = [];
    for (const user_id of chId) {
      ret.push(this.hideSensitive(await User.findById(user_id)));
    }
    return ret;
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

  async getSubs(user, myUsername, search) {
    const ret = [];
    if (!this.isUserAuthorized(myUsername, user.username)) {
      throw new Error('Unathorized');
    }

    const myUser = await User.findOne({ login: myUsername });
    if (!myUser) {
      throw new Error('invalid username');
    }
    const theirUser = await User.findOne({ login: search });
    if (!theirUser) {
      throw new Error('invalid username');
    }

    const chUs = await ChannelUser.find({ user_id: theirUser._id.toString() });
    const chId = [];
    for (const c of chUs) {
      chId.push(c.channel_id);
    }
    let channels = [];
    for (const id of chId) {
      channels.push(await Channel.findById(id));
    }
    for (const ch of channels) {
      switch (ch.type) {
        case 'PRIVATEGROUP':
          if (await this.checkSubscribed(ch, myUser)) {
            ret.push(await this.loadChannelData(ch));
          }
          break;
        case 'PUBLICGROUP':
        case 'MOD':
          ret.push(await this.loadChannelData(ch));
          break;
        default:
          break;
      }
    }
    return ret;
  }

  async countSubs(user, myUsername, search) {
    const subs = await this.getSubs(user, myUsername, search);
    return subs.length;
  }

  addPrefix(channel) {
    switch (channel.type) {
      case 'MOD':
      case 'PRIVATEGROUP':
        return '§' + channel.name;
      case 'PUBLICGROUP':
        return '#' + channel.name;
    }
  }

  isIncorrectName(q) {
    return q.includes('§') || q.includes('#') || q.includes('@') || q.toLowerCase() !== q;
  }

  isMod(user) {
    for (const a of user.authorities) {
      if (a === 'ROLE_ADMIN') {
        return true;
      }
    }
    return false;
  }

  async checkSubscribed(ch, myUser) {
    const check = await ChannelUser.find({ channel_id: ch._id.toString(), user_id: myUser._id.toString() });
    return check != null;
  }

  async loadChannelData(channel) {
    if (!channel) {
      throw new Error('loading data failed');
    }
    const users = await ChannelUser.find({ channel_id: channel._id.toString() });
    return {
      channel: channel,
      users: users,
    };
  }

  isUserAuthorized(id, currentUserId) {
    return id.toString() == currentUserId.toString();
  }
}

module.exports = ChannelService;
