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
    if (await new channelUserService().userHasReadPrivilege(channel, thisUser)) {
      ret = await this.loadChannelData(channel);
    }
    return ret;
  }

  async addPeopleToChannel(user, myUsername, channelId, userIds) {
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
    if (!(await new channelUserService().userHasWritePrivilege(channel, thisUser))) {
      throw new Error('Unathorized');
    }
    for (const u of userIds) {
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

  async deleteChannel(user, channelId) {
    if (!channelId) {
      throw new Error('invalid channel');
    }
    if (!user?.username) {
      throw new Error('invalid user');
    }

    const thisUser = await User.findOne({ login: user?.username });
    if (!thisUser) {
      throw new Error('invalid user');
    }
    if (!(await new accountService().isMod(thisUser))) {
      throw new Error('Unathorized');
    }
    const deleted = await Channel.deleteOne({ _id: channelId });
    return deleted;
  }

  async removeChannel(channel, user) {
    if (!channel || !channel._id) {
      throw new Error('invalid channel');
    }
    if (!user || !user.username) {
      throw new Error('invalid user');
    }
    const thisUser = await User.findOne({ login: user.username });
    if (!thisUser) {
      throw new Error('invalid user');
    }
    if (!(await new accountService().isMod(thisUser))) {
      throw new Error('Unathorized');
    }
    const deleted = await Channel.deleteOne({ _id: channel._id });
    return deleted;
  }

  async editChannel(channel, user) {
    const thisUser = await User.findOne({ login: user.username });
    if (!thisUser) {
      throw new Error('invalid user');
    }
    if (!(await new accountService().isMod(thisUser))) {
      throw new Error('Unathorized');
    }
    if (!channel || !channel._id) {
      throw new Error('invalid channel');
    }
    const channel_updated = await Channel.updateOne({ _id: channel._id }, channel);
    return channel_updated;
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
      if (await new channelUserService().userHasReadPrivilege(ch, thisUser)) {
        ret.push(await this.loadChannelData(ch));
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
      if (userSub || channel.type != 'PRIVATEGROUP') {
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
      //if (await new channelUserService().userHasReadPrivilege(ch, myUser)) {
      ret.push(await this.loadChannelData(ch));
      //}
    }
    return ret;
  }

  async countChannelSubscribedTo(user, myUsername, search) {
    const subs = await this.getChannelSubscribedTo(user, myUsername, search);
    return subs.length;
  }

  addPrefix(channel) {
    if (!channel.name) {
      return;
    }
    if (channel.name.includes('§') || channel.name.includes('#') || channel.name.includes('@')) {
      return channel.name;
    }
    switch (channel.type) {
      case 'MOD':
      case 'PRIVATEGROUP':
        return '§' + channel.name;
      case 'PUBLICGROUP':
        return '#' + channel.name;
    }
  }

  isIncorrectName(q) {
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
