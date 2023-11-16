const Squeal = require('../model/squeal');
const { v1: uuidv1, v4: uuidv4 } = require('uuid');
const SquealDestination = require('../model/squealDestination');
const ChannelUser = require('../model/channelUser');
const Channel = require('../model/channel');
const SquealCat = require('../model/squealCat');
const SquealReaction = require('../model/squealReaction');
const SquealViews = require('../model/squealViews');
const User = require('../model/user');
const smmVIP = require('../model/smmVIP');
const reactionService = require('../service/ReactionService');
const accountService = require('./AccountService');
const channelUserService = require('./ChannelUserService');
const ChannelService = require('./ChannelService');
const GeoLoc = require('../model/geoLoc');
const squeal = require('../model/squeal');

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
    const thisUser = await User.findOne({ login: username });
    if (!thisUser) {
      throw new Error('Invalid username');
    }
    if (!(await new accountService().isUserAuthorized(user, thisUser))) {
      throw new Error('Unauthorized');
    }

    const squeals = await Squeal.find({ user_id: thisUser._id.toString(), timestamp: { $gte: Date.now() - msinMonth } });
    let chRemMonth = chMonth;
    let chRemWeek = chWeek;
    let chRemDay = chDay;
    for (const s of squeals) {
      const destId = [];
      for (const d of s.destination) {
        if (d.destination_type) {
          destId.push(d.destination_type);
        }
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
    const thisUser = await User.findOne({ login: username });
    if (!thisUser) {
      throw new Error('Invalid username');
    }
    if (!(await new accountService().isUserAuthorized(user, thisUser))) {
      throw new Error('Unauthorized');
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
      let validDest = [];
      for (const d of s.destination) {
        if (chId.includes(d.destination_id)) {
          validDest.push(d);
        }
      }
      if (validDest == []) {
        continue;
      }
      s.destination = validDest;
      const dto = await this.loadSquealData(s, thisUser);

      if (dto) {
        ret.push(dto);
      }
    }
    return ret;
  }

  async getSquealListCmt(page, size, user, username) {
    const ret = [];
    const thisUser = await User.findOne({ login: username });
    if (!thisUser) {
      throw new Error('Invalid username');
    }
    if (!(await new accountService().isUserAuthorized(user, thisUser))) {
      throw new Error('Unauthorized');
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

    const sq = await Squeal.find({ 'destination.destination_id': { $in: chId }, squeal_id_response: null })
      .limit(size)
      .skip(size * page)
      .sort({ timestamp: -1 });
    console.log(sq);

    for (const s of sq) {
      let validDest = [];
      for (const d of s.destination) {
        if (chId.includes(d.destination_id)) {
          validDest.push(d);
        }
      }

      if (validDest == []) {
        continue;
      }

      s.destination = validDest;
      const dto = await this.loadSquealData(s, thisUser);

      if (dto) {
        ret.push(dto);
      }
    }
    return ret;
  }

  async getSquealById(user, username, id) {
    const thisUser = await User.findOne({ login: username });
    if (!thisUser) {
      throw new Error('Username Invalid');
    }
    if (!(await new accountService().isUserAuthorized(user, thisUser))) {
      throw new Error('Unathorized');
    }
    const s = await Squeal.findById(id);
    return await this.loadSquealData(s, thisUser);
  }

  async getSquealsSentByUser(page, size, user, myUsername, theirUsername) {
    const ret = [];
    const theirUser = await User.findOne({ login: theirUsername });
    const myUser = await User.findOne({ login: myUsername });
    if (!theirUser || !myUser) {
      throw new Error('Username Invalid');
    }
    if (!(await new accountService().isUserAuthorized(user, myUser))) {
      throw new Error('Unathorized');
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
    const theirUser = await User.findOne({ login: theirUsername });
    const myUser = await User.findOne({ login: myUsername });
    if (!theirUser || !myUser) {
      throw new Error('Username Invalid');
    }
    if (!(await new accountService().isUserAuthorized(user, myUser))) {
      throw new Error('Unathorized');
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
    const theirUser = await User.findOne({ login: theirUsername });
    const myUser = await User.findOne({ login: myUsername });
    if (!theirUser || !myUser) {
      throw new Error('Username Invalid');
    }
    if (!(await new accountService().isUserAuthorized(user, myUser))) {
      throw new Error('Unathorized');
    }
    return await Squeal.countDocuments({ user_id: theirUser._id.toString(), squeal_id_response: null });
  }

  async getSquealByChannel(page, size, user, myUsername, id) {
    const ret = [];
    const thisUser = await User.findOne({ login: myUsername });
    if (!thisUser) {
      throw new Error('Username Invalid');
    }
    if (!(await new accountService().isUserAuthorized(user, thisUser))) {
      throw new Error('Unathorized');
    }
    const squeals = await Squeal.find({ 'destination.destination_id': id })
      .limit(size)
      .skip(size * page)
      .sort({ timestamp: -1 });
    for (const s of squeals) {
      let validDest = [];
      for (const d of s.destination) {
        if (d.destination_id == id || (await new channelUserService().checkSubscribed(d, thisUser))) {
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

  async countSquealMadeByUser(user, myUsername, theirUsername) {
    const theirUser = await User.findOne({ login: theirUsername });
    const myUser = await User.findOne({ login: myUsername });
    if (!theirUser || !myUser) {
      throw new Error('Username Invalid');
    }
    if (!(await new accountService().isUserAuthorized(user, myUser))) {
      throw new Error('Unathorized');
    }
    const chTypes = ['MOD', 'PUBLICGROUP'];
    return await Squeal.countDocuments({ user_id: theirUser._id.toString(), 'destination.destination_type': { $in: chTypes } });
  }

  async updateGeoLoc(geoLoc, user, myUsername) {
    if (this.geoLocIsInvalid(geoLoc)) {
      throw new Error('GeoLoc invalid');
    }
    const ret = [];
    const thisUser = await User.findOne({ login: myUsername });
    if (!thisUser) {
      throw new Error('Username Invalid');
    }
    if (!(await new accountService().isUserAuthorized(user, thisUser))) {
      throw new Error('Unathorized');
    }
    loc = await GeoLoc.findByIdAndUpdate(geoLoc._id.toString(), {
      latitude: geoLoc.latitude,
      longitude: geoLoc.longitude,
      accuracy: geoLoc.accuracy,
      speed: geoLoc.speed,
      heading: geoLoc.heading,
      timestamp: Date.now(),
    });
    if (!loc) {
      throw new Error('could not add geoloc');
    }
    return loc;
  }

  geoLocIsInvalid(geoLoc) {
    if (!geoLoc.latitude || !geoLoc.longitude || !geoLoc._id.toString() || !geoLoc.squeal_id) {
      return treu;
    }
    return false;
  }

  async checkSubscribed(d, thisUser) {
    if (!d || !d.destination_type) {
      throw new Error('destination not found');
    }
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

    const thisUser = await User.findOne({ login: myUsername });
    if (!thisUser) {
      throw new Error('Username Invalid');
    }
    if (!(await new accountService().isUserAuthorized(user, thisUser))) {
      throw new Error('Unathorized');
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

  async insertOrUpdate(squeal, user, username, geoLoc) {
    let ret = {};
    const thisUser = await User.findOne({ login: username });
    if (!squeal || !thisUser) {
      throw new Error('Invalid data');
    }
    if (!(await new accountService().isUserAuthorized(user, thisUser))) {
      throw new Error('Unauthorized');
    }

    if (squeal.squeal_id_response) {
      let valid = false;
      const referencing_squeal = await Squeal.findById(squeal.squeal_id_response);
      if (!referencing_squeal) {
        throw new Error('referencing squeal not found');
      }
      for (const dest of referencing_squeal.destination) {
        if (this.userHasReadPrivilege(thisUser, dest)) {
          valid = true;
        }
      }
      if (!valid) {
        throw new Error('Unauthorized');
      }
    }

    let newSqueal = new Squeal({
      user_id: thisUser._id.toString(),
      timestamp: Date.now(),
      body: squeal.body,
      img: this.resizeSquealImg(squeal.img),
      img_content_type: squeal.img_content_type,
      img_name: squeal.img_name,
      video_content_type: squeal.video_content_type,
      video_name: squeal.video_name,
      n_characters: this.getNCharacters(squeal) ?? 0,
      destination: [],
      squeal_id_response: squeal.squeal_id_response,
    });
    for (const dest of squeal.destination) {
      if (await this.userHasWritePrivilege(dest, thisUser)) {
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

    if (geoLoc) {
      await GeoLoc.create({
        squeal_id: newSqueal._id.toString(),
        user_id: thisUser._id.toString(),
        latitude: geoLoc.latitude,
        longitude: geoLoc.longitude,
        accuracy: geoLoc.accuracy,
        heading: geoLoc.heading,
        speed: geoLoc.speed,
        timestamp: newSqueal.timestamp,
      });
    }
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
    if (!(await new accountService().isUserAuthorized(myUser, thisUser))) {
      throw new Error('Unauthorized');
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
        if (this.userHasWritePrivilege(dest, thisUser)) {
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

  async getSquealComments(myUser, theirUsername, squeal_id) {
    const ret = [];
    const thisUser = await User.findOne({ login: theirUsername });
    if (!thisUser) {
      throw new Error('Invalid Username');
    }
    if (!new accountService().isUserAuthorized(myUser, thisUser)) {
      throw new Error('Unathorized');
    }
    const squeals = await Squeal.find({ squeal_id_response: squeal_id });
    for (const s of squeals) {
      const dto = await this.loadSquealData(s, thisUser);
      if (dto) {
        ret.push(dto);
      }
    }
    return ret;
  }

  async getSquealRankByReaction(page, size, myUser, theirUsername) {
    let squealRank = [];
    const thisUser = await User.findOne({ login: theirUsername });
    if (!thisUser) {
      throw new Error('Invalid Username');
    }
    if (!new accountService().isUserAuthorized(myUser, thisUser)) {
      throw new Error('Unathorized');
    }

    const squeals = await Squeal.find({ user_id: thisUser._id.toString() });

    for (const s of squeals) {
      const dto = await this.loadSquealData(s, thisUser);
      if (dto && s.squeal_id_response == null) {
        squealRank.push(dto);
      }
    }
    squealRank.sort((a, b) => b.reaction_number - a.reaction_number);

    return squealRank.slice((page - 1) * size, page * size);
  }

  async getSquealRankByReactionInverse(page, size, myUser, theirUsername) {
    let squealRank = [];
    const thisUser = await User.findOne({ login: theirUsername });
    if (!thisUser) {
      throw new Error('Invalid Username');
    }
    if (!new accountService().isUserAuthorized(myUser, thisUser)) {
      throw new Error('Unathorized');
    }

    const squeals = await Squeal.find({ user_id: thisUser._id.toString() });

    for (const s of squeals) {
      const dto = await this.loadSquealData(s, thisUser);
      if (dto && s.squeal_id_response == null) {
        squealRank.push(dto);
      }
    }
    squealRank.sort((a, b) => a.reaction_number - b.reaction_number);

    return squealRank.slice((page - 1) * size, page * size);
  }

  async getSquealRankByComments(page, size, myUser, theirUsername) {
    let squealRank = [];
    const thisUser = await User.findOne({ login: theirUsername });
    if (!thisUser) {
      throw new Error('Invalid Username');
    }
    if (!new accountService().isUserAuthorized(myUser, thisUser)) {
      throw new Error('Unathorized');
    }

    const squeals = await Squeal.find({ user_id: thisUser._id.toString() });

    for (const s of squeals) {
      const dto = await this.loadSquealData(s, thisUser);
      if (dto && s.squeal_id_response == null) {
        squealRank.push(dto);
      }
    }
    squealRank.sort((a, b) => b.comments_number - a.comments_number);

    return squealRank.slice((page - 1) * size, page * size);
  }

  async getSquealRankByCommentsInverse(page, size, myUser, theirUsername) {
    let squealRank = [];
    const thisUser = await User.findOne({ login: theirUsername });
    if (!thisUser) {
      throw new Error('Invalid Username');
    }
    if (!new accountService().isUserAuthorized(myUser, thisUser)) {
      throw new Error('Unathorized');
    }

    const squeals = await Squeal.find({ user_id: thisUser._id.toString() });

    for (const s of squeals) {
      const dto = await this.loadSquealData(s, thisUser);
      if (dto && s.squeal_id_response == null) {
        squealRank.push(dto);
      }
    }
    squealRank.sort((a, b) => a.comments_number - b.comments_number);
    return squealRank.slice((page - 1) * size, page * size);
  }

  async getSquealRankByViews(page, size, myUser, theirUsername) {
    let squealRank = [];
    const thisUser = await User.findOne({ login: theirUsername });
    if (!thisUser) {
      throw new Error('Invalid Username');
    }
    if (!new accountService().isUserAuthorized(myUser, thisUser)) {
      throw new Error('Unathorized');
    }

    const squeals = await Squeal.find({ user_id: thisUser._id.toString() });

    for (const s of squeals) {
      const dto = await this.loadSquealData(s, thisUser);
      if (dto && s.squeal_id_response == null) {
        squealRank.push(dto);
      }
    }
    squealRank.sort((a, b) => b.views.number - a.views.number);

    return squealRank.slice((page - 1) * size, page * size);
  }

  async getSquealRankByViewsInverse(page, size, myUser, theirUsername) {
    let squealRank = [];
    const thisUser = await User.findOne({ login: theirUsername });
    if (!thisUser) {
      throw new Error('Invalid Username');
    }
    if (!new accountService().isUserAuthorized(myUser, thisUser)) {
      throw new Error('Unathorized');
    }

    const squeals = await Squeal.find({ user_id: thisUser._id.toString() });

    for (const s of squeals) {
      const dto = await this.loadSquealData(s, thisUser);
      if (dto && s.squeal_id_response == null) {
        squealRank.push(dto);
      }
    }
    squealRank.sort((a, b) => a.views.number - b.views.number);

    return squealRank.slice((page - 1) * size, page * size);
  }

  async getSquealRankByPositive(page, size, myUser, theirUsername) {
    let squealRank = [];
    const thisUser = await User.findOne({ login: theirUsername });
    if (!thisUser) {
      throw new Error('Invalid Username');
    }
    if (!new accountService().isUserAuthorized(myUser, thisUser)) {
      throw new Error('Unathorized');
    }

    const squeals = await Squeal.find({ user_id: thisUser._id.toString() });

    for (const s of squeals) {
      const dto = await this.loadSquealData(s, thisUser);
      if (dto && s.squeal_id_response == null) {
        squealRank.push(dto);
      }
    }
    squealRank.sort((a, b) => b.positive - a.positive);

    return squealRank.slice((page - 1) * size, page * size);
  }

  async getSquealRankByNegative(page, size, myUser, theirUsername) {
    let squealRank = [];
    const thisUser = await User.findOne({ login: theirUsername });
    if (!thisUser) {
      throw new Error('Invalid Username');
    }
    if (!new accountService().isUserAuthorized(myUser, thisUser)) {
      throw new Error('Unathorized');
    }

    const squeals = await Squeal.find({ user_id: thisUser._id.toString() });

    for (const s of squeals) {
      const dto = await this.loadSquealData(s, thisUser);
      if (dto && s.squeal_id_response == null) {
        squealRank.push(dto);
      }
    }
    squealRank.sort((a, b) => b.negative - a.negative);

    return squealRank.slice((page - 1) * size, page * size);
  }

  async getSquealRankByPosNegRateo(page, size, myUser, theirUsername) {
    let squealRank = [];
    const thisUser = await User.findOne({ login: theirUsername });
    if (!thisUser) {
      throw new Error('Invalid Username');
    }
    if (!new accountService().isUserAuthorized(myUser, thisUser)) {
      throw new Error('Unathorized');
    }

    const squeals = await Squeal.find({ user_id: thisUser._id.toString() });

    for (const s of squeals) {
      const dto = await this.loadSquealData(s, thisUser);
      if (dto && s.squeal_id_response == null) {
        squealRank.push(dto);
      }
    }
    squealRank.sort((a, b) => b.positive - b.negative - (a.positive - a.negative));

    return squealRank.slice((page - 1) * size, page * size);
  }

  async getSquealTimeChart(myUser, theirUsername) {
    let userDataset = [];
    let num = 1;
    let prevTimestamp = new Date();
    var firstDate = true;
    const thisUser = await User.findOne({ login: theirUsername });
    if (!thisUser) {
      throw new Error('Invalid Username');
    }
    if (!new accountService().isUserAuthorized(myUser, thisUser)) {
      throw new Error('Unathorized');
    }

    const squeals = await Squeal.find({ user_id: thisUser._id.toString() }).sort({ timestamp: 1 });

    for (const s of squeals) {
      var timestamp = new Date(s.timestamp);
      if (!firstDate) {
        if (timestamp.toLocaleDateString('it-IT') === prevTimestamp.toLocaleDateString('it-IT')) {
          num++;
        } else {
          userDataset.push({
            x: prevTimestamp.toLocaleDateString('it-IT'),
            y: num,
          });
          num = 1;
        }
      } else {
        firstDate = false;
      }
      prevTimestamp = timestamp;
    }
    userDataset.push({
      x: prevTimestamp.toLocaleDateString('it-IT'),
      y: num,
    });
    console.log('SQUEALS: ', userDataset);

    return userDataset;
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

  async userHasWritePrivilege(destination, thisUser) {
    if (!destination || !destination.destination_type) {
      throw new Error('destination not found or incomplete');
    }
    switch (destination.destination_type) {
      case 'MOD':
        return new accountService().isMod(thisUser);
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
          if (!newdest) {
            throw new Error('unable to create new channel');
          }
          destination.destination_id = newdest._id.toString();
        }
        return true;
      case 'MESSAGE':
        return true;
      default:
        return false;
    }
  }

  async userHasReadPrivilege(thisUser, destination) {
    if (!destination || !destination.destination_type) {
      throw new Error('destination not found or incomplete');
    }
    switch (destination.destination_type) {
      case 'PRIVATEGROUP':
        const userSub = await ChannelUser.findOne({ channel_id: destination.destination_id, user_id: thisUser._id.toString() });
        if (userSub) {
          return true;
        }
        break;
      case 'MOD':
      case 'PUBLICGROUP':
      case 'MESSAGE':
        return true;
      default:
        return false;
    }
  }

  async calcCharsChangedWithPopularity(user, myUsername) {
    const ret = [];
    const thisUser = await User.findOne({ login: myUsername });
    if (!thisUser) {
      throw new Error('Username Invalid');
    }
    if (!(await new accountService().isUserAuthorized(user, thisUser))) {
      throw new Error('Unathorized');
    }

    let squeals = await Squeal.find({ user_id: thisUser._id.toString(), timestamp: { $gte: Date.now() - msinMonth } });
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
  async calcCharsChangedbySqueal(squeal) {
    const ret = [];

    const thisUser = await User.findOne({ login: myUsername });
    if (!thisUser) {
      throw new Error('Username Invalid');
    }
    if (!(await new accountService().isUserAuthorized(user, thisUser))) {
      throw new Error('Unathorized');
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

  async getCommentsNumber(squeal_id) {
    const comments = await Squeal.find({
      squeal_id_response: squeal_id,
    });
    return comments.length;
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

    const reaction_number = await new reactionService().getReactionNumber(squeal_id);

    const positive = await new reactionService().getPositiveReactionNumber(squeal_id);

    const negative = await new reactionService().getNegativeReactionNumber(squeal_id);

    const active_reaction = await new reactionService().getActiveReaction(thisUser._id.toString(), squeal_id);

    const comments_number = await this.getCommentsNumber(squeal_id);

    const views = await SquealViews.findOne({ squeal_id });

    const geoLoc = await GeoLoc.findOne({ squeal_id });

    const ret = {
      userName: squeal_user.login,
      squeal,
      category,
      reactions,
      active_reaction,
      reaction_number,
      positive,
      negative,
      comments_number,
      views,
      geoLoc,
    };
    return ret;
  }
  resizeSquealImg(img) {
    //TODO:implement
    return img;
  }

  getNCharacters(squeal) {
    if (!squeal || !squeal.body) {
      throw new Error('squeal not found');
    }
    let n = squeal.body.length;
    if (squeal.img && squeal.img != '') {
      n = n + 100;
    }
    return n;
  }
}

module.exports = SquealService;
