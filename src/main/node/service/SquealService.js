const Squeal = require('../model/squeal');
const { v1: uuidv1, v4: uuidv4 } = require('uuid');
const SquealDestination = require('../model/squealDestination');
const ChannelUser = require('../model/channelUser');
const Channel = require('../model/channel');
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
      .sort({ timestamp: -1 });

    for (const s of sq) {
      const dto = await this.loadSquealData(s);

      if (dto) {
        ret.push(dto);
      }
    }

    return ret;
  }

  async getSquealsSentByUser(page, size, user, myUsername, theirUsername) {
    const ret = [];
    if (this.isUserAuthorized(myUsername, user.username)) {
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
      const dto = await this.loadSquealData(s);

      if (dto) {
        ret.push(dto);
      }
    }
    return ret;
  }

  async getDirectSquealPreview(user, myUsername) {
    const ret = [];
    if (this.isUserAuthorized(myUsername, user.username)) {
      throw new Error('Unathorized');
    }

    const myUser = await User.findOne({ login: myUsername });
    if (!myUser) {
      throw new Error('Username Invalid');
    }

    let squeals = await Squeal.find({ 'destination.destination_id': myUser._id.toString() });
    let squealsSent = await Squeal.find({
      user_id: myUser._id.toString(),
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
      const dto = await this.loadSquealData(s);
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
    for (const dest of squeal.destinations) {
      if (await this.checkAuth(dest, thisUser)) {
        newSqueal.destination.seen = false;
        newSqueal.destination.push(dest);
      }
    }

    newSqueal = await newSqueal.save();
    await SquealViews.create({
      squeal_id: newSqueal._id.toString(),
      number: 0,
    });

    const dto = await this.loadSquealData(newSqueal);

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
    if (this.isUserAuthorized(thisUser._id, myUser.user_id)) {
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
        if (await ChannelUser.findOne({ channel_id: destination.destination_id, user_id: thisUser.toString() })) {
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

  async loadSquealData(squeal) {
    if (!squeal) {
      throw new Error('Nothing to Load');
    }
    const user = await User.findById({ _id: squeal.user_id });
    if (!user) {
      throw new Error('User not found');
    }

    const squeal_id = squeal._id.toString();

    const cat = await SquealCat.findOne({ squeal_id });

    const reactions = await this.getReaction(squeal_id);

    const views = await SquealViews.findOne({ squeal_id });

    const ret = {
      userName: user.login,
      squeal: squeal,
      category: cat,
      reactions: reactions,
      views: views,
    };
    return ret;
  }
  resizeImg(img) {
    //TODO:implement
    return img;
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
