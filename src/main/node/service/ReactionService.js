const Squeal = require('../model/squeal');
const Channel = require('../model/channel');
const SquealCat = require('../model/squealCat');
const SquealReaction = require('../model/squealReaction');
const SquealViews = require('../model/squealViews');
const User = require('../model/user');
const accountService = require('./AccountService');
const Notify = require('../model/notification');
const socket = require('../socket');

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
CATTHRESHOLD = 0.5;
VIEWSTHRESHOLD = 0;
POSITIVETHRESHOLD = 0.8;
NEGATIVETHRESHOLD = 0.8;
BASEMULTIPLIER = 10;
POSITIVEMULTIPLIER = 3;
NEGATIVEMULTIPLIER = 2;

class ReactionService {
  async insertOrUpdateReaction(reaction, user, username) {
    const thisUser = await User.findOne({ login: username });
    if (!thisUser) {
      throw new Error('Invalid username');
    }
    if (!(await new accountService().isUserAuthorized(user, thisUser))) {
      throw new Error('Unauthorized');
    }
    const found = await SquealReaction.findOne({ user_id: thisUser._id.toString(), squeal_id: reaction.squeal_id });
    if (found) {
      await SquealReaction.deleteOne(found);

      if (found.emoji == reaction.emoji) {
        await this.updateCat(reaction.squeal_id, thisUser._id.toString());
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
    if (!found) {
      const squeal = await Squeal.findById(reaction.squeal_id);
      const message = new Notify({
        username: thisUser.login,
        reaction: reaction.emoji,
        destId: squeal.user_id,
        timestamp: Date.now(),
        type: 'REACTION',
        isRead: false,
      });
      socket.sendNotification(message);
    }
    await this.updateCat(reaction.squeal_id, thisUser._id.toString());
    return ret;
  }

  async updateCat(squeal_id, user_id) {
    const views = await SquealViews.findOne({ squeal_id: squeal_id });
    const positive = await this.getPositiveReactionNumber(squeal_id);
    const negative = await this.getNegativeReactionNumber(squeal_id);
    const total = negative + positive;
    if (total / views.number > CATTHRESHOLD && views.number > VIEWSTHRESHOLD) {
      let cat = await SquealCat.findOne({ squeal_id: squeal_id });
      let catType = 'INVALID';
      if (positive / total > POSITIVETHRESHOLD) {
        catType = 'POPULAR';
      }
      if (negative / total > NEGATIVETHRESHOLD) {
        if (catType == 'POPULAR') {
          catType = 'CONTROVERSIAL';
        } else {
          catType = 'UNPOPULAR';
        }
      }
      const base_characters = BASEMULTIPLIER * Math.sign(positive - negative);
      const n_characters = positive * POSITIVEMULTIPLIER - negative * NEGATIVEMULTIPLIER + base_characters;
      if (!cat) {
        cat = await SquealCat.create({
          squeal_id: squeal_id,
          user_id: user_id,
          cat_type: catType,
          n_characters: n_characters,
          timestamp: Date.now(),
        });
      } else {
        await SquealCat.findOneAndUpdate(cat.id.toString(), { cat_type: catType, n_characters: n_characters });
      }
      this.addCatModChannel(cat);
      return;
    }
    const cat = await SquealCat.findOne({ squeal_id: squeal_id });
    if (cat) {
      await SquealCat.deleteOne(cat);
    }
    return;
  }
  async addCatModChannel(squealCat) {
    let found = false;
    let update = false;
    let ispublic = false;
    const squeal = await Squeal.findById(squealCat.squeal_id);
    if (!squeal) {
      throw new Error('squeal not found');
    }
    const available_dest = ['POPULAR', 'UNPOPULAR', 'CONTROVERSIAL'];
    for (const dest of squeal.destination) {
      if (available_dest.includes(dest.destination.substring(1))) {
        if (dest.destination == squealCat.cat_type) {
          found = true;
        } else {
          update = true;
          squeal.destination.splice(squeal.destination.indexOf(dest), 1);
        }
      } else {
        if (dest.destination_type != 'PRIVATEGROUP' && dest.destination_type != 'MESSAGE') {
          ispublic = true;
        }
      }
    }
    if (update) {
      await Squeal.findByIdAndUpdate(squeal._id, squeal);
    }
    if (found || !ispublic) {
      return;
    }
    let channel = await Channel.findOne({ name: '§'.concat(squealCat.cat_type), type: 'MOD' });
    if (!channel) {
      channel = await Channel.create({
        name: '§'.concat(squealCat.cat_type),
        type: 'MOD',
      });
    }
    squeal.destination.push({
      destination_id: channel._id.toString(),
      destination: channel.name,
      destination_type: 'MOD',
      seen: 0,
      admin_add: true,
    });
    await Squeal.findByIdAndUpdate(squeal._id, squeal);
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

  async getReactionNumber(squeal_id) {
    const reactions = await SquealReaction.find({ squeal_id: squeal_id });
    return reactions.length;
  }

  async getPositiveReactionNumber(squeal_id) {
    const reaction = await SquealReaction.find({ squeal_id: squeal_id, positive: true });
    return reaction.length;
  }

  async getNegativeReactionNumber(squeal_id) {
    const reactions = await SquealReaction.find({ squeal_id: squeal_id, positive: false });
    return reactions.length;
  }
}

module.exports = ReactionService;
