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
  async searchChannel(user, myUsername, search) {
    const ret = [];
    if (this.isUserAuthorized(myUsername, user.username)) {
      const myUser = await User.findOne({ login: myUsername });
      if (!myUser) {
        return ret;
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
