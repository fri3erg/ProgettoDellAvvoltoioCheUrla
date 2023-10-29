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
    let ret = [];
    if (this.isUserAuthorized(myUsername, user.username)) {
      const myUser = await User.findOne({ login: myUsername });
      if (!myUser) {
        return ret;
      }
      if (search.startsWith('@')) {
        search = search.substring(1);
      }
      ret = await User.find({ login: { $regex: '(?i).*' + search + '.*' } });
    }
    return ret;
  }
}

module.exports = ChannelService;
