const Squeal = require('../model/squeal');
const SquealDestination = require('../model/squealDestination');
const ChannelUser = require('../model/channelUser');
const Channel = require('../model/channel');
const SquealCat = require('../model/squealCat');
const SquealReaction = require('../model/squealReaction');
const SquealViews = require('../model/squealViews');
const User = require('../model/user');

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

  async checkSubscribed(ch, myUser) {
    const check = await ChannelUser.find({ channel_id: ch._id, user_id: myUser._id });
    return check != null;
  }

  async loadChannelData(channel) {
    if (!channel) {
      return null;
    }
    const users = await ChannelUser.find({ channel_id: channel._id });
    return {
      channel: channel,
      users: users,
    };
  }

  isUserAuthorized(id, currentUserId) {
    return id == currentUserId;
  }
}

module.exports = ChannelService;
