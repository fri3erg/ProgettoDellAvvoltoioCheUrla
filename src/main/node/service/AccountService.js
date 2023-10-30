const Squeal = require('../model/squeal');
const SquealDestination = require('../model/squealDestination');
const ChannelUser = require('../model/channelUser');
const Channel = require('../model/channel');
const SquealCat = require('../model/squealCat');
const SquealReaction = require('../model/squealReaction');
const SquealViews = require('../model/squealViews');
const User = require('../model/user');

class ChannelService {
  async getUsersByName(user, myUsername, search) {
    if (this.isUserAuthorized(myUsername, user.username)) {
      throw new Error('unauthorized');
    }
    const myUser = await User.findOne({ login: myUsername });
    if (!myUser) {
      throw new Error('bad username');
    }

    if (search.startsWith('@')) {
      search = search.substring(1);
    }
    return await User.find({ login: { $regex: '(?i).*' + search + '.*' } });
  }
}

module.exports = ChannelService;
