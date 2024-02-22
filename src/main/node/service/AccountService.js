const SMMVIP = require('../model/smmVIP');
const User = require('../model/user');
const AdminExtra = require('../model/adminExtras');
const SquealCat = require('../model/squealCat');
const SquealViews = require('../model/squealViews');
const SquealReaction = require('../model/squealReaction');
const GeoLoc = require('../model/geoLoc');
const Notification = require('../model/notification');
const squeal = require('../model/squeal');
const Jimp = require('jimp');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const config = require('../config/env');
const nodemailer = require('nodemailer');
const squealReaction = require('../model/squealReaction');

class AccountService {
  async getUsersByName(user, myUsername, search, byRole, byPopolarity) {
    const thisUser = await User.findOne({ login: myUsername });
    if (!thisUser) {
      throw new Error('bad username');
    }

    if (!(await this.isUserAuthorized(user, thisUser))) {
      throw new Error('unauthorized');
    }
    let users = [];
    if (byRole) {
      users = await User.find({ authorities: byRole });
    }
    if (byPopolarity) {
      const result = await SquealCat.aggregate([
        {
          $group: {
            _id: '$user_id',
            totalCharacters: { $sum: '$n_characters' },
          },
        },
        { $sort: { totalCharacters: byPopolarity } },
        { $limit: 5 },
      ]);
      for (const res of result) {
        users.push(await User.findById(res._id));
      }
    }
    if (!byRole && !byPopolarity) {
      users = await this.searchUser(search);
    }
    let ret = [];
    for (const us of users) {
      ret.push(await this.hideSensitive(us));
    }
    return ret;
  }

  async listFilteredUsers(user, page, size, byName, byRole, byPopularity) {
    var result = [];
    const thisUser = await User.findOne({ login: user.username });
    if (!thisUser) {
      throw new Error('bad username');
    }

    if (!(await this.isMod(thisUser))) {
      throw new Error('unauthorized');
    }
    if (byName == 1 || byName == -1) {
      result = await User.find()
        .sort({ login: byName })
        .limit(size)
        .skip(size * page);
    } else if (
      byRole.toString() == 'ROLE_USER' ||
      byRole.toString() == 'ROLE_SMM' ||
      byRole.toString() == 'ROLE_ADMIN' ||
      byRole.toString() == 'ROLE_VIP'
    ) {
      result = await User.find({ authorities: byRole })
        .limit(size)
        .skip(size * page);
    } else if (byPopularity == 1 || byPopularity == -1) {
      const temp = await SquealViews.aggregate([
        {
          $group: {
            _id: '$user_id',
            totalViews: { $sum: '$number' },
          },
        },
        // Ordina in base alla popolarità
        { $sort: { totalViews: byPopularity } },
        // Skip e Limit per la paginazione
        { $skip: page * size },
        { $limit: size },
      ]);
      for (const t of temp) {
        result.push(await User.findById(t._id));
      }
    } else {
      result = await User.find()
        .limit(size)
        .skip(size * page);
    }

    let users = [];
    for (const r of result) {
      if (r) {
        users.push(await this.hideSensitive(r));
      }
    }
    return users;
  }

  async block(user, hisUsername, block) {
    const thisUser = await User.findOne({ login: user.username });
    if (!thisUser) {
      throw new Error('bad username');
    }

    if (!(await this.isMod(thisUser))) {
      throw new Error('unauthorized');
    }
    console.log(hisUsername, block);
    const ret = await User.findOneAndUpdate({ login: hisUsername }, { activated: block });
    return await this.hideSensitive(ret);
  }

  async getUserImg(id) {
    const user = await User.findById(id);
    return user.img;
  }
  async getUserImgContentType(id) {
    const user = await User.findById(id);
    return user.img_content_type;
  }

  async searchUser(search) {
    search = search.trim().replace(/[@§#]/g, '');

    return await User.find({ login: { $regex: '(?i).*' + search + '.*' } });
  }

  async update(user, myUsername, account) {
    const thisUser = await User.findOne({ login: myUsername });
    if (!thisUser) {
      throw new Error('bad username');
    }
    if (!(await this.isUserAuthorized(user, thisUser))) {
      throw new Error('unauthorized');
    }
    if (account.first_name) {
      thisUser.first_name = account.first_name;
    }
    if (account.last_name) {
      thisUser.last_name = account.last_name;
    }
    if (account.email) {
      thisUser.email = account.email;
    }
    if (account.lang_key) {
      thisUser.lang_key = account.lang_key;
    }

    return await this.hideSensitive(await User.findOneAndUpdate({ login: thisUser.login }, thisUser));
  }

  async getUser(user, myUsername, name) {
    const thisUser = await User.findOne({ login: myUsername });
    if (!thisUser) {
      throw new Error('bad username');
    }
    if (!(await this.isUserAuthorized(user, thisUser))) {
      throw new Error('unauthorized');
    }

    if (name.startsWith('@')) {
      name = name.substring(1);
    }
    return await this.hideSensitive(await User.findOne({ login: name }));
  }

  //not tested
  async addVip(user, myUsername) {
    const thisUser = await User.findOne({ login: myUsername });
    if (!thisUser) {
      throw new Error('bad username');
    }
    if (!(await this.isUserAuthorized(user, thisUser))) {
      throw new Error('unauthorized');
    }
    if (this.isUserVip(thisUser)) {
      throw new Error('you already have that role');
    }
    const auth = thisUser.authorities.push('ROLE_VIP');
    return await this.hideSensitive(await User.findOneAndUpdate({ login: thisUser.login }, { authorities: auth }));
  }

  //not tested
  async addAdminExtra(user, adminExtra) {
    const thisUser = await User.findOne({ login: user.username });
    if (!thisUser) {
      throw new Error('bad username');
    }
    if (!(await this.isMod(thisUser))) {
      throw new Error('unauthorized');
    }
    const admin_extra = await AdminExtra.create({
      n_characters: adminExtra.n_characters,
      user_id: adminExtra.user_id,
      timestamp: adminExtra.timestamp,
      admin_created: thisUser.login,
    });
    return admin_extra;
  }

  async addCharToClient(user, clientUsername, char) {
    const myUser = await User.findOne({ login: clientUsername });
    if (!myUser) {
      throw new Error('invalid username');
    }

    if (!(await this.isUserAuthorized(user, myUser))) {
      throw new Error('Unathorized');
    }

    await AdminExtra.create({
      n_characters: char,
      user_id: myUser._id.toString(),
      timestamp: Date.now(),
      admin_created: 'SMM',
    });
    return 'ch added';
  }

  async delete(user) {
    const thisUser = await User.findOne({ login: user.username });
    const user_id = thisUser._id.toString();
    if (!thisUser) {
      throw new Error('bad username');
    }

    const deleted = await User.findOneAndDelete({ login: thisUser.login });
    const squeals = await squeal.find({ user_id: thisUser._id.toString() });
    for (const squeal of squeals) {
      const squeal_deleted = await squeal.deleteOne({ _id: squeal._id.toString() });
      const squealCat_deleted = await SquealCat.deleteMany({ squeal_id: squeal._id.toString() });
      const squealViews_deleted = await SquealViews.deleteMany({ squeal_id: squeal._id.toString() });
      const geoLoc_deleted = await GeoLoc.deleteMany({ squeal_id: squeal._id.toString() });
      const reactions_deleted = await SquealReaction.deleteMany({ squeal_id: squeal._id.toString() });
      const comments_deleted = await squeal.deleteMany({ squeal_id_response: squeal._id.toString() });
    }
    const smmVIP = await SMMVIP.deleteMany({ user_id: thisUser._id.toString() });
    const adminExtra = await AdminExtra.deleteMany({ user_id: thisUser._id.toString() });
    const notifications = await Notification.deleteMany({ user_id: thisUser._id.toString() });
    const channelUser = await ChannelUser.deleteMany({ user_id: thisUser._id.toString() });
    const smmUser = await SMMVIP.find({ users: thisUser._id.toString() });
    for (const user of smmUser) {
      user.users = user.users.filter(e => e !== thisUser._id.toString());
      await SMMVIP.findOneAndUpdate({ user_id: user.user_id }, user);
    }

    return deleted;
  }

  async imgUpdate(user, myUsername, account) {
    const thisUser = await User.findOne({ login: myUsername });
    if (!thisUser) {
      throw new Error('bad username');
    }
    if (!(await this.isUserAuthorized(user, thisUser))) {
      throw new Error('unauthorized');
    }
    const userupdated = await User.findOneAndUpdate(
      { login: thisUser.login },
      { img: await this.resizeUserImg(account.img), img_content_type: account.img_content_type }
    );
    const updated = await this.hideSensitive(await User.findOne({ login: myUsername }));
    return updated;
  }

  async hideSensitive(account) {
    if (!account) {
      throw new Error('account not found');
    }
    const n_characters = await this.getUserChars(account.login);
    const positive = await this.getTotalPosReaction(account.login);
    const negative = await this.getTotalNegReaction(account.login);
    const views = await this.countViews(account._id.toString());
    return {
      login: account.login,
      _id: account._id.toString(),
      first_name: account.first_name,
      last_name: account.last_name,
      img: account.img,
      email: account.email,
      imgContentType: account.imgContentType,
      authorities: account.authorities,
      lang_key: account.lang_key,
      positive: positive,
      negative: negative,
      views: views,
      n_characters: n_characters,
    };
  }

  async getUserChars(username) {
    const thisUser = await User.findOne({ login: username });
    if (!thisUser) throw new Error('Invalid username');

    const purchased = await AdminExtra.find({ user_id: thisUser._id.toString(), valid_until: { $gte: Date.now() } });
    const ch_purchased = purchased.reduce((acc, p) => acc + p.n_characters, 0);
    const squeals = await squeal.find({
      user_id: thisUser._id.toString(),
      timestamp: { $gte: Date.now() - config.msinMonth },
      destination: {
        $elemMatch: {
          destination_type: { $in: ['PRIVATEGROUP', 'PUBLICGROUP'] },
        },
      },
    });

    const ids = squeals.map(s => s._id.toString());

    const cats = await SquealCat.find({ squeal_id: { $in: ids } });
    const ch_total = cats.reduce((acc, c) => acc + c.n_characters, 0);

    let chRemMonth = parseInt(config.chMonth + ch_total + ch_purchased);
    let [chRemWeek, chRemDay] = [chRemMonth, chRemMonth].map(ch =>
      parseInt(ch / (ch === chRemMonth ? config.monthWeekMultiplier : config.weekDayMultiplier))
    );

    squeals.forEach(s => {
      const nChars = s.n_characters;
      chRemMonth -= nChars;
      if (s.timestamp > Date.now() - config.msinWeek) {
        chRemWeek -= nChars;
        if (s.timestamp > Date.now() - config.msinDay) {
          chRemDay -= nChars;
        }
      }
    });

    const extra_admin = await AdminExtra.find({ user_id: thisUser._id.toString() });
    const extra_admin_ch = extra_admin.reduce((acc, e) => acc + e.n_characters, 0);
    [chRemMonth, chRemWeek, chRemDay] = [chRemMonth, chRemWeek, chRemDay].map(ch => ch + extra_admin_ch);

    const remainingChars = Math.min(chRemDay, chRemWeek, chRemMonth);
    const type = remainingChars === chRemDay ? 'DAY' : remainingChars === chRemWeek ? 'WEEK' : 'MONTH';

    return { remainingChars, type };
  }

  async isMod(user) {
    if (!user) {
      throw new Error('invalid user');
    }
    if (!user.authorities) {
      user = await User.findById(user.user_id);
    }
    if (user.authorities.includes('ROLE_ADMIN')) {
      return true;
    }
    return false;
  }

  async isUserVip(user) {
    if (!user) {
      throw new Error('invalid user');
    }
    if (!user.authorities) {
      user = await User.findOne({ login: user.user_id });
    }
    if (user.authorities.includes('ROLE_VIP')) {
      return true;
    }
    return false;
  }

  async resizeUserImg(img) {
    if (!img) {
      return;
    }

    // Load the image from a base64 string
    const image = await Jimp.read(Buffer.from(img, 'base64'));

    // Resize the image
    image.resize(1280, Jimp.AUTO);

    // Lower the quality for compression
    // Note: Jimp's quality function works a bit differently, it's a scale from 0 to 100
    image.quality(60);

    // Get the buffer of the processed image in JPEG format
    const compressedImageBuffer = await image.getBufferAsync(Jimp.MIME_JPEG);

    const compressedBase64 = compressedImageBuffer.toString('base64');
    return [compressedBase64];
  }

  async isUserAuthorized(myUser, theirUser) {
    if (!myUser || !theirUser) {
      throw new Error('invalid username');
    }
    if (await this.isMod(myUser)) {
      return true;
    }
    if (myUser.user_id.toString() == theirUser._id.toString() || this.isUserClient(theirUser, myUser)) {
      return true;
    }
    if (myUser._id.toString() == theirUser.user_id.toString() || this.isUserClient(myUser, theirUser)) {
      return true;
    }
    if (myUser._id.toString() == theirUser._id.toString()) {
      return true;
    }
    return false;
  }

  async isUserClient(client, user) {
    const smmUser = await SMMVIP.findOne({ user_id: user.user_id });
    if (!smmUser.users) {
      throw new Error('you dont have any clients');
    }
    for (const user of smmUser.users) {
      if (client._id.toString() === user) {
        return true;
      }
    }
    return false;
  }

  async listUsers(user, page, size) {
    const thisUser = await User.findOne({ login: user.username });
    if (!thisUser) {
      throw new Error('bad username');
    }
    if (!(await this.isMod(thisUser))) {
      throw new Error('unauthorized');
    }
    return await User.find()
      .limit(size)
      .skip(size * page);
  }

  async resetPasswordKnown(user, currentPassword, newPassword) {
    const thisUser = await User.findOne({ login: user.username });
    if (!thisUser) {
      throw new Error('bad username');
    }

    //Encrypt user password
    const encryptedPassword = await bcrypt.hash(currentPassword, 10);
    if (encryptedPassword !== thisUser.password) {
      throw new Error('invalid password');
    }
    const encryptedNewPassword = await bcrypt.hash(newPassword, 10);

    if (newPassword.length < 4 || newPassword.length > 100) {
      throw new Error('invalid password');
    }

    thisUser.password = encryptedNewPassword;
    return thisUser.save();
  }

  async getUsersRandom(size) {
    const ret = [];

    const users = await User.aggregate([{ $sample: { size: size } }]);

    for (const u of users) {
      ret.push(await this.hideSensitive(u));
    }
    return ret;
  }

  async resetPasswordInit(user, mail) {
    const thisUser = await User.findOne({ login: user.username });
    if (!thisUser) {
      throw new Error('bad username');
    }
    const resetKey = crypto.randomBytes(20).toString('hex');
    thisUser.activation_key = resetKey;
    thisUser.timestamp_activation = Date.now();
    thisUser.save();
    this.sendResetPasswordMail(mail, resetKey);
    return `https://site222347.tw.cs.unibo.it/reset-password?resetKey=${resetKey}`;
  }
  sendResetPasswordMail(mail, key) {
    let transporter = nodemailer.createTransport({
      host: 'smtp.your-email-provider.com', // Replace with your mail server host
      port: 587, // Common port for SMTP
      secure: false, // true for 465, false for other ports
      auth: {
        user: config.EMAIL, // Your email address
        pass: config.EMAIL_PASSWORD, // Your email password or app-specific password
      },
    });
    let mailOptions = {
      from: '"Squealer" <support@squealer.com>', // Sender address
      to: mail,
      subject: 'Password Reset Request', // Subject line
      text: `You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\nPlease click on the following link, or paste this into your browser to complete the process:\n\nhttp://yoursocialmediaapp.com/reset-password?token=RandomTokenHere\n\nIf you did not request this, please ignore this email and your password will remain unchanged.\n`, // Plain text body
      html: `
      <p>You are receiving this email because you (or someone else) have requested the reset of the password for your account.</p>
      <p>Please click on the following link, or paste this into your browser to complete the process:</p>
      <a href="${key}">Reset Password</a>
      <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
    `, // HTML body content
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error);
      }
      console.log('Message sent: %s', info.messageId);
    });
    console.log('sending mail to ' + mail + ' with key ' + key);
  }

  async resetPasswordFinish(user, newPassword, key) {
    const thisUser = await User.findOne({ login: user.username });
    if (!thisUser) {
      throw new Error('bad username');
    }
    if (thisUser.activation_key !== key) {
      throw new Error('invalid key');
    }
    if (thisUser.timestamp_activation < Date.now() - 1860000) {
      throw new Error('key expired');
    }
    const encryptedNewPassword = await bcrypt.hash(newPassword, 10);
    thisUser.password = encryptedNewPassword;
    return thisUser.save();
  }

  async getTotalPosReaction(username) {
    const squeals = await squeal.find({ user_id: username });
    let total = 0;
    for (const squeal of squeals) {
      total += await squealReaction.countDocuments({ squeal_id: squeal._id, reaction: 'positive' });
    }
    return total;
  }

  async getTotalNegReaction(username) {
    const squeals = await squeal.find({ user_id: username });
    let total = 0;
    for (const squeal of squeals) {
      total += await SquealReaction.countDocuments({ squeal_id: squeal._id, reaction: 'negative' });
    }
    return total;
  }

  async countViews(id) {
    const squeals = await squeal.find({ user_id: id });
    let total = 0;
    for (const squeal of squeals) {
      total += await SquealViews.countDocuments({ squeal_id: squeal._id.toString() });
    }
    return total;
  }
}
module.exports = AccountService;
