const Squeal = require('../model/squeal');
const SquealDestination = require('../model/squealDestination');
const ChannelUser = require('../model/channelUser');
const Channel = require('../model/channel');
const SquealCat = require('../model/squealCat');
const SquealReaction = require('../model/squealReaction');
const SquealViews = require('../model/squealViews');
const User = require('../model/user');
const { isModuleNamespaceObject } = require('util/types');

class ChannelUserService {
  async deleteSubscription(user, username, channel_id) {
    if (!this.isUserAuthorized(username, user.username)) {
      throw new Error('Unauthorized');
    }
    const thisUser = await User.findOne({ login: username });
    if (!thisUser) {
      throw new Error('Invalid username');
    }
    const deleted = await ChannelUser.deleteOne({ user_id: thisUser._id.toString(), channel_id });
    if (!deleted) {
      throw new Error('error in deletion');
    }
    return deleted;
  }
  async addSubscription(user, username, channel_id) {
    if (!this.isUserAuthorized(username, user.username)) {
      throw new Error('Unauthorized');
    }
    const thisUser = await User.findOne({ login: username });
    if (!thisUser) {
      throw new Error('Invalid username');
    }
    const created = await ChannelUser.create({ user_id: thisUser._id.toString(), channel_id });
    if (!created) {
      throw new Error('error in creation');
    }
    return created;
  }
}

module.exports = ChannelUserService;
