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
    let createOwner = true;
    let ret = {};
    const thisUser = await User.findOne({ login: username });
    if (!channel || !thisUser) {
      throw new Error('Not authorized');
    }
    if (!this.isUserAuthorized(thisUser._id, user.user_id)) {
      throw new Error('Not authorized');
    }
    if (this.isIncorrectName(channel.name)) {
      throw new Error('Name Invalid');
    }
    const oldChannel = await Channel.findOne({ name: channel.name });
    if (oldChannel) {
      createOwner = false;
      if (await ChannelUser.findOne({ channel_id: oldChannel._id.toString(), user_id: thisUser._id.toString() })) {
        throw new Error('You can only have one channel with this name');
      }
    }
    if (channel.type == 'MOD' && !this.isMod(thisUser)) {
      throw new Error('You do not have permission');
    }
    if (!channel.name || !channel.type) {
      throw new Error('Incomplete');
    }

    let newChannel = new Channel({
      name: channel.name,
      type: channel.type,
    });

    newChannel = await newChannel.save();
    if (createOwner) {
      await ChannelUser.create({});
    }
    const dto = await this.loadChannelData(newChannel);

    if (dto) {
      ret = newChannel;
    }

    return ret;
  }

  isIncorrectName(q) {
    if (q.includes('§') || q.includes('#') || q.includes('@') || !(q.toLowerCase() === q)) {
      return true;
    }
    return false;
  }

  isMod(user) {
    for (const a of user.authorities) {
      if (a._id === 'ROLE_ADMIN') {
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
      return null;
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
