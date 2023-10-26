const Squeal = require('../model/squeal');
const SquealDestination = require('../model/squealDestination');
const ChannelUser = require('../model/channelUser');
const SquealCat = require('../model/squealCat');
const SquealReaction = require('../model/squealReaction');
const SquealViews = require('../model/squealViews');
const User = require('../model/user');
class ReactionDTO {
  n_characters;
  number = 0;
  reaction = '';
  constructor(emoji) {
    this.reaction = emoji;
  }
  add() {
    number++;
  }
}
//params:
//page and size for paging
//user for auth and isUserAuthorized
//username,user to do action on, default: you, but smm
class SquealService {
  async getSquealList(page, size, user, username) {
    const ret = [];
    if (this.isUserAuthorized(username, user.username)) {
      const thisUser = await User.findOne({ login: username });
      const chUs = await ChannelUser.find({ user_id: thisUser._id });

      let chId = [];
      for (const us of chUs) {
        chId.push(us.channel_id.toString());
      }

      const sq = await Squeal.find({ 'destination.destination_id': { $in: chId } }).sort({ timestamp: -1 });

      console.log(sq);
      for (const s of sq) {
        const dto = await this.loadSquealData(s);

        if (dto) {
          ret.push(dto);
        }
      }
    }
    return ret;
  }

  async getSquealsSentByUser(page, size, user, myUsername, theirUsername) {
    const ret = [];
    if (this.isUserAuthorized(myUsername, user.username)) {
      const theirUser = await User.find({ login: theirUsername });
      const myUser = await User.find({ login: myUsername });

      let squealsReceived = await Squeal.find({ 'destination.destination_id': myUser._id, user_id: theirUser._id });
      let squealsSent = await Squeal.find({ 'destination.destination_id': theirUser._id.toString(), user_id: myUser._id.toString() });
      let squeals = squealsReceived.concat(squealsSent).sort({ timestamp: 1 });

      for (const s of squeals) {
        const dto = await this.loadSquealData(s);

        if (dto) {
          ret.push(dto);
        }
      }
    }
    return ret;
  }

  async loadSquealData(squeal) {
    if (squeal == null) {
      return null;
    }
    const user = await User.findOne({ _id: squeal.user_id });

    const squealId = squeal._id.toString();

    const cat = await SquealCat.findOne({ squeal_id: squealId });

    const reactions = await this.getReaction(squealId);

    const views = await SquealViews.findOne({ squeal_id: squealId });

    const ret = {
      userName: user.login,
      squeal: squeal,
      category: cat,
      reactions: reactions,
      views: views,
    };
    return ret;
  }
  async getReaction(id) {
    const reactions = await SquealReaction.find({ squeal_id: id });

    const map = new Map();
    for (const reaction of reactions) {
      const emoji = reaction.emoji;
      let r = map.get(emoji);
      if (r == null) {
        r = new ReactionDTO(emoji);
        map.set(emoji, r);
      }
      r.number++;
    }

    return Array.from(map.values()).sort((a, b) => a.number - b.number);
  }

  isUserAuthorized(id, currentUserId) {
    return id == currentUserId;
  }
}
module.exports = SquealService;
