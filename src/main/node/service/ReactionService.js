const Squeal = require('../model/squeal');
const SquealDestination = require('../model/squealDestination');
const ChannelUser = require('../model/channelUser');
const Channel = require('../model/channel');
const SquealCat = require('../model/squealCat');
const SquealReaction = require('../model/squealReaction');
const SquealViews = require('../model/squealViews');
const User = require('../model/user');
const { isModuleNamespaceObject } = require('util/types');
const AccountService = require('./AccountService');
class ReactionDTO {
  user;
  number = 0;
  reaction = '';
  constructor(emoji) {
    this.reaction = emoji;
  }
  add() {
    number++;
  }
}
class ReactionService {
  async insertOrUpdateReaction(reaction, user, username) {
    const thisUser = await User.findOne({ login: username });
    if (!thisUser) {
      throw new Error('Invalid username');
    }
    if (!new AccountService().isUserAuthorized(user, thisUser)) {
      throw new Error('Unauthorized');
    }
    const found = await SquealReaction.findOne({ user_id: thisUser._id.toString(), squeal_id: reaction.squeal_id });
    if (found) {
      await SquealReaction.deleteOne(found);
      if (found.emoji == reaction.emoji) {
        return {
          emoji: 'deleted',
        };
      }
    }
    const ret = await SquealReaction.create({
      user_id: thisUser._id.toString(),
      squeal_id: reaction.squeal_id,
      emoji: reaction.emoji,
      positive: reaction.positive,
      username,
    });
    if (!ret) {
      throw new Error('could not create');
    }
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

  async getActiveReaction(user_id, squeal_id) {
    const reaction = await SquealReaction.findOne({ user_id, squeal_id });
    if (reaction) {
      return reaction.emoji;
    }

    return null;
  }
}

module.exports = ReactionService;
