const Squeal = require('../model/squeal');
const { v1: uuidv1, v4: uuidv4 } = require('uuid');
const SquealDestination = require('../model/squealDestination');
const ChannelUser = require('../model/channelUser');
const Channel = require('../model/channel');
const SquealCat = require('../model/squealCat');
const SquealReaction = require('../model/squealReaction');
const SquealViews = require('../model/squealViews');
const User = require('../model/user');
const reactionService = require('../service/ReactionService');

const chDay = 100;
const chWeek = chDay * 4;
const chMonth = chWeek * 3;
const msinMonth = 2629800000;
const msinWeek = 604800000;
const msinDay = 86400000;
//params:
//page and size for paging
//user for auth and isUserAuthorized
//username,user to do action on, default: you, but smm
class SquealService {
  async getUserChars(user, username) {
    if (!this.isUserAuthorized(username, user.username)) {
      throw new Error('Unauthorized');
    }
    const thisUser = await User.findOne({ login: username });
    if (!thisUser) {
      throw new Error('Invalid username');
    }

    const squeals = await Squeal.find({ user_id: thisUser._id.toString(), timestamp: { $gte: Date.now() - msinMonth } });
    let chRemMonth = chMonth;
    let chRemWeek = chWeek;
    let chRemDay = chDay;
    for (const s of squeals) {
      const destId = [];
      for (const d of s.destination) {
        destId.push(d.destination_type);
      }
      if (!(destId.includes('MOD') || destId.includes('PUBLICGROUP') || destId.includes('PRIVATEGROUP'))) {
        continue;
      }
      if (s.timestamp > Date.now() - msinWeek) {
        chRemWeek = chRemWeek - s.n_characters;
        if (s.timestamp > Date.now() - msinDay) {
          chRemDay = chRemDay - s.n_characters;
        }
      }
      chRemMonth = chRemMonth - s.n_characters;
    }
    let type = 'DAY';
    const remainingChars = Math.min(chRemDay, chRemWeek, chRemMonth);
    if (chRemWeek == remainingChars) {
      type = 'WEEK';
    }
    if (chRemMonth == remainingChars) {
      type = 'MONTH';
    }
    return {
      remainingChars,
      type,
    };
  }

  async getSquealList(page, size, user, username) {
    const ret = [];
    if (!this.isUserAuthorized(username, user.login)) {
      throw new Error('Unauthorized');
    }
    const thisUser = await User.findOne({ login: username });
    if (!thisUser) {
      throw new Error('Invalid username');
    }
    const chUs = await ChannelUser.find({ user_id: thisUser._id.toString() });

    let chId = [];
    for (const us of chUs) {
      chId.push(us.channel_id);
    }
    const chMod = await Channel.find({ type: 'MOD' });
    for (const c of chMod) {
      chId.push(c._id.toString());
    }
    const sq = await Squeal.find({ 'destination.destination_id': { $in: chId } })
      .limit(size)
      .skip(size * page)
      .sort({ timestamp: +1 });

    for (const s of sq) {
      let validDest = [];
      for (const d of s.destination) {
        if (chId.includes(d.destination_id)) {
          validDest.push(d);
        }
      }
      s.destination = validDest;
      const dto = await this.loadSquealData(s, thisUser);

      if (dto) {
        ret.push(dto);
      }
    }

    return ret;
  }

  async getSquealsSentByUser(page, size, user, myUsername, theirUsername) {
    const ret = [];
    if (!this.isUserAuthorized(myUsername, user.username)) {
      throw new Error('Unathorized');
    }
    const theirUser = await User.findOne({ login: theirUsername });
    const myUser = await User.findOne({ login: myUsername });
    if (!theirUser || !myUser) {
      throw new Error('Username Invalid');
    }
    let squealsSent = [];
    let squealsReceived = await Squeal.find({ 'destination.destination_id': myUser._id.toString(), user_id: theirUser._id.toString() })
      .limit(size)
      .skip(size * page)
      .sort({ timestamp: 1 });
    if (theirUser.login !== myUsername) {
      squealsSent = await Squeal.find({ 'destination.destination_id': theirUser._id.toString(), user_id: myUser._id.toString() })
        .limit(size)
        .skip(size * page)
        .sort({ timestamp: 1 });
    }
    let squeals = squealsReceived.concat(squealsSent);

    for (const s of squeals) {
      const dto = await this.loadSquealData(s, myUser);

      if (dto) {
        ret.push(dto);
      }
    }
    return ret;
  }

  async getSquealMadeByUser(page, size, user, myUsername, theirUsername) {
    const ret = [];
    if (!this.isUserAuthorized(myUsername, user.username)) {
      throw new Error('Unathorized');
    }
    const theirUser = await User.findOne({ login: theirUsername });
    const myUser = await User.findOne({ login: myUsername });
    if (!theirUser || !myUser) {
      throw new Error('Username Invalid');
    }
    const chTypes = ['MOD', 'PUBLICGROUP'];
    const squeals = await Squeal.find({ user_id: theirUser._id.toString(), 'destination.destination_type': { $in: chTypes } })
      .limit(size)
      .skip(size * page)
      .sort({ timestamp: -1 });
    for (const s of squeals) {
      let validDest = [];
      for (const d of s.destination) {
        if (await this.checkSubscribed(d, myUser)) {
          validDest.push(d);
        }
      }
      s.destination = validDest;
      const dto = await this.loadSquealData(s, myUser);

      if (dto) {
        ret.push(dto);
      }
    }
    return ret;
  }

  async countSquealMadeByUser(user, myUsername, theirUsername) {
    if (!this.isUserAuthorized(myUsername, user.username)) {
      throw new Error('Unathorized');
    }
    const theirUser = await User.findOne({ login: theirUsername });
    const myUser = await User.findOne({ login: myUsername });
    if (!theirUser || !myUser) {
      throw new Error('Username Invalid');
    }
    const chTypes = ['MOD', 'PUBLICGROUP'];
    return await Squeal.countDocuments({ user_id: theirUser._id.toString(), 'destination.destination_type': { $in: chTypes } });
  }

  async getSquealByChannel(page, size, user, myUsername, id) {
    const ret = [];
    if (!this.isUserAuthorized(myUsername, user.username)) {
      throw new Error('Unathorized');
    }
    const thisUser = await User.findOne({ login: myUsername });
    if (!thisUser) {
      throw new Error('Username Invalid');
    }
    const squeals = await Squeal.find({ 'destination.destination_id': id })
      .limit(size)
      .skip(size * page)
      .sort({ timestamp: -1 });
    for (const s of squeals) {
      let validDest = [];
      for (const d of s.destination) {
        if (d.destination_id == id || (await this.checkSubscribed(d, thisUser))) {
          validDest.push(d);
        }
      }
      s.destination = validDest;
      const dto = await this.loadSquealData(s, thisUser);

      if (dto) {
        ret.push(dto);
      }
    }
    return ret;
  }

  async checkSubscribed(d, thisUser) {
    switch (d.destination_type) {
      case 'MOD':
      case 'PUBLICGROUP':
        return true;
      case 'PRIVATEGROUP':
        const userSub = await ChannelUser.findOne({ channel_id: d.destination_id, user_id: thisUser._id.toString() });
        if (userSub) {
          return true;
        }
      default:
        return false;
    }
  }

  async getDirectSquealPreview(user, myUsername) {
    const ret = [];
    if (!this.isUserAuthorized(myUsername, user.username)) {
      throw new Error('Unathorized');
    }

    const thisUser = await User.findOne({ login: myUsername });
    if (!thisUser) {
      throw new Error('Username Invalid');
    }

    let squeals = await Squeal.find({ 'destination.destination_id': thisUser._id.toString() });
    let squealsSent = await Squeal.find({
      user_id: thisUser._id.toString(),
      'destination.destination_id': { $regex: '(?i)' + '@' + '.*' },
    });
    squeals = squeals.concat(squealsSent);
    const map = new Map();
    for (const s of squeals) {
      const user = s.user_id;
      let n = s;
      map.set(user, n);
    }

    squeals = Array.from(map.values()).sort((a, b) => b.timestamp - a.timestamp);

    for (const s of squeals) {
      const dto = await this.loadSquealData(s, thisUser);
      if (dto) {
        ret.push(dto);
      }
    }
    return ret;
  }

  async insertOrUpdate(squeal, user, username) {
    let ret = {};
    const thisUser = await User.findOne({ login: username });
    if (!squeal || !thisUser) {
      throw new Error('Invalid data');
    }
    if (!this.isUserAuthorized(thisUser._id, user.user_id)) {
      throw new Error('Not authorized');
    }
    let newSqueal = new Squeal({
      user_id: thisUser._id.toString(),
      timestamp: Date.now(),
      body: squeal.body,
      img: this.resizeImg(squeal.img),
      img_content_type: squeal.img_content_type,
      img_name: squeal.img_name,
      video_content_type: squeal.video_content_type,
      video_name: squeal.video_name,
      n_characters: this.getNCharacters(squeal) ?? 0,
      destination: [],
    });
    for (const dest of squeal.destination) {
      if (await this.checkAuth(dest, thisUser)) {
        newSqueal.destination.seen = false;
        newSqueal.destination.push(dest);
      }
    }
    if (newSqueal.destination.length == 0) {
      throw new Error('no valid destinations');
    }
    newSqueal = await newSqueal.save();
    await SquealViews.create({
      squeal_id: newSqueal._id.toString(),
      number: 1,
    });

    const dto = await this.loadSquealData(newSqueal, thisUser);

    if (dto) {
      ret = newSqueal;
    }
    return ret;
  }

  async getSquealDestination(myUser, username, search) {
    let validDest = [];
    const thisUser = await User.findOne({ login: username });
    if (!thisUser) {
      throw new Error('Invalid Username');
    }
    if (!this.isUserAuthorized(thisUser._id, myUser.user_id)) {
      throw new Error('Unathorized');
    }

    if (!search.startsWith('§') && !search.startsWith('#')) {
      const userDest = await this.searchUser(search);
      for (const us of userDest) {
        const dest = new SquealDestination({
          destination_id: us._id.toString(),
          destination: us.login ?? '',
          destination_type: 'MESSAGE',
        });
        validDest.push(dest);
      }
    }
    if (!search.startsWith('#') && !search.startsWith('@')) {
      const ChannelDest = await this.searchChannel('§', search, username);

      for (const ch of ChannelDest) {
        const dest = new SquealDestination({
          destination_id: ch._id.toString(),
          destination: ch.name ?? '',
          destination_type: ch.type,
        });
        if (this.checkAuth(dest, thisUser)) {
          validDest.push(dest);
        }
      }
    }
    if (!search.startsWith('§') && !search.startsWith('@')) {
      const publicFind = await this.searchChannel('#', search, username);
      for (const ch of publicFind) {
        const dest = new SquealDestination({
          destination_id: ch._id.toString(),
          destination: ch.name ?? '',
          destination_type: 'PUBLICGROUP',
        });
        validDest.push(dest);
      }
      if (search.startsWith('#')) {
        validDest.push({
          destination: search,
          destination_type: 'PUBLICGROUP',
        });
      }
    }
    return validDest;
  }

  async searchUser(search) {
    return User.find({ login: { $regex: '(?i).*' + search + '.*' } });
  }

  async searchChannel(ch, search, username) {
    if (search.startsWith('§') || search.startsWith('@')) {
      search = search.substring(1);
    }
    return await Channel.find({ name: { $regex: ch + '(?i).*' + search + '.*' } });
  }

  async checkAuth(destination, thisUser) {
    switch (destination.destination_type) {
      case 'MOD':
        return this.isMod(thisUser);
      case 'PRIVATEGROUP':
        const userSub = await ChannelUser.findOne({ channel_id: destination.destination_id, user_id: thisUser._id.toString() });
        if (userSub) {
          return true;
        }
        break;
      case 'PUBLICGROUP':
        if (!destination.destination_id && destination.destination) {
          const newdest = await Channel.create({
            name: destination.destination,
            type: 'PUBLICGROUP',
          });
          destination.destination_id = newdest._id.toString();
        }
        return true;
      case 'MESSAGE':
        return true;
      default:
        return false;
    }
  }

  isMod(user) {
    for (const a of user.authorities) {
      if (a === 'ROLE_ADMIN') {
        return true;
      }
    }
    return false;
  }

  async loadSquealData(squeal, thisUser) {
    if (!squeal) {
      throw new Error('Nothing to Load');
    }
    const squeal_user = await User.findById({ _id: squeal.user_id });
    if (!squeal_user) {
      throw new Error('User not found');
    }

    const squeal_id = squeal._id.toString();

    const category = await SquealCat.findOne({ squeal_id });

    const reactions = await new reactionService().getReaction(squeal_id);

    const active_reaction = await new reactionService().getActiveReaction(thisUser._id.toString(), squeal_id);

    const views = await SquealViews.findOne({ squeal_id });

    const ret = {
      userName: squeal_user.login,
      squeal,
      category,
      reactions,
      active_reaction,
      views,
    };
    return ret;
  }
  resizeImg(img) {
    //TODO:implement
    return img;
  }

  isUserAuthorized(id, currentUserId) {
    return id.toString() == currentUserId.toString();
  }
  getNCharacters(squeal) {
    let n = squeal.body.length;
    if (squeal.img && squeal.img != '') {
      n = n + 100;
    }
    return n;
  }
}

module.exports = SquealService;
