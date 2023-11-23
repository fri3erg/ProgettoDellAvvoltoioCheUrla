const Squeal = require('../model/squeal');
const SquealDestination = require('../model/squealDestination');
const ChannelUser = require('../model/channelUser');
const Channel = require('../model/channel');
const SquealCat = require('../model/squealCat');
const SquealReaction = require('../model/squealReaction');
const SquealViews = require('../model/squealViews');
const User = require('../model/user');
const { isModuleNamespaceObject } = require('util/types');
const channelUserService = require('../service/ChannelUserService');
const accountService = require('../service/AccountService');

class ChannelService {
  async getChannel(user, myUsername, id) {
    let ret = {};
    const thisUser = await User.findOne({ login: myUsername });
    if (!thisUser) {
      throw new Error('username invalid');
    }
    if (!(await new accountService().isUserAuthorized(user, thisUser))) {
      throw new Error('Unathorized');
    }
    let channel = await Channel.findById(id);
    if (!channel || !channel.type) {
      throw new Error('channel not found or without type');
    }
    switch (channel.type) {
      case 'PRIVATEGROUP':
        if (await new channelUserService().checkSubscribed(channel, thisUser)) {
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

  async addPeopleToChannel(user, myUsername, channelId, UserIds) {
    const thisUser = await User.findOne({ login: myUsername });
    const chUsers = [];
    if (!thisUser) {
      throw new Error('invalid username');
    }
    if (!(await new accountService().isUserAuthorized(user, thisUser))) {
      throw new Error('Unathorized');
    }
    const channel = await Channel.findById(channelId);
    if (!channel) {
      throw new Error('invalid channel');
    }
    if (channel.type != 'PRIVATEGROUP') {
      throw new Error('invalid channel type');
    }
    if (!(await new channelUserService().checkSubscribed(channel, thisUser))) {
      throw new Error('Unathorized');
    }
    for (const u of UserIds) {
      const theirUser = await User.findById(u);
      if (!theirUser) {
        throw new Error('invalid username');
      }
      const alreadyExists = await ChannelUser.findOne({ channel_id: channel._id.toString(), user_id: theirUser._id.toString() });
      if (alreadyExists) {
        continue;
      }
      const chUser = await ChannelUser.create({
        channel_id: channel._id.toString(),
        user_id: theirUser._id.toString(),
        privilege: 'WRITE',
      });
      if (!chUser) {
        continue;
      }
      chUsers.push(chUser);
    }

    return chUsers;
  }

  async searchChannel(user, myUsername, search) {
    const ret = [];
    const thisUser = await User.findOne({ login: myUsername });
    if (!thisUser) {
      throw new Error('invalid username');
    }
    if (!(await new accountService().isUserAuthorized(user, thisUser))) {
      throw new Error('Unathorized');
    }
    let channels = await Channel.find({ name: { $regex: '(?i).*' + search + '.*' } });

    for (const ch of channels) {
      switch (ch.type) {
        case 'PRIVATEGROUP':
          if (await new channelUserService().checkSubscribed(ch, thisUser)) {
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
    const thisUser = await User.findOne({ login: username });
    if (!channel || !thisUser) {
      throw new Error('invalid data');
    }
    if (!(await new accountService().isUserAuthorized(user, thisUser))) {
      throw new Error('Not authorized');
    }
    if (this.isIncorrectName(channel)) {
      throw new Error('Name Invalid');
    }
    if (!channel.name || !channel.type) {
      throw new Error('Incomplete');
    }
    if (channel.type == 'MOD' && !new accountService().isMod(thisUser)) {
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
    if (!newChannel) {
      throw new Error('could not save channel');
    }
    const chUser = await ChannelUser.create({
      channel_id: newChannel._id.toString(),
      user_id: thisUser._id.toString(),
      privilege: 'ADMIN',
    });
    if (!chUser) {
      throw new Error('could not create subscription');
    }

    const dto = await this.loadChannelData(newChannel);

    return dto;
  }

  async getChannelSubscribedTo(user, myUsername, search) {
    const ret = [];

    const myUser = await User.findOne({ login: myUsername });
    if (!myUser) {
      throw new Error('invalid username');
    }

    if (!(await new accountService().isUserAuthorized(user, myUser))) {
      throw new Error('Unathorized');
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
          if (await new channelUserService().checkSubscribed(ch, myUser)) {
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

  async countChannelSubscribedTo(user, myUsername, search) {
    const subs = await this.getChannelSubscribedTo(user, myUsername, search);
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
    console.log(q.name);
    let includes = q.name.includes('§') || q.name.includes('#') || q.name.includes('@');
    let valid = true;
    switch (q.type) {
      case 'MOD':
        valid = q.name.toUpperCase() === q.name;
        break;
      case 'PRIVATEGROUP':
        valid = q.name.toLowerCase() === q.name;
        break;
      default:
        break;
    }
    return !valid || includes;
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
}

module.exports = ChannelService;
