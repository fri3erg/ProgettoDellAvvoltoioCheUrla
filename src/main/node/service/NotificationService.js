const User = require('../model/user');

const socket = require('../socket');
const accountService = require('../service/AccountService');
const notification = require('../model/notification');

class NotificationService {
  async getNotification(page, size, user, username) {
    const ret = [];
    const thisUser = await User.findOne({ login: username });
    if (!thisUser) {
      throw new Error('Invalid username');
    }
    if (!(await new accountService().isUserAuthorized(user, thisUser))) {
      throw new Error('Unauthorized');
    }

    var notifications = await notification
      .find({ destId: thisUser._id.toString() })
      .limit(size)
      .skip(size * page)
      .lean()
      .sort({ timestamp: -1 });

    await notification.updateMany({ destId: thisUser._id.toString() }, { isRead: true });

    if (!notifications) {
      return res.status(400).json({ message: 'No notifications found' });
    }

    for (const n of notifications) {
      ret.push(n);
    }
    return ret;
  }

  async setReadDirect(user, username, direct_name) {
    const thisUser = await User.findOne({ login: username });
    if (!thisUser) {
      throw new Error('Invalid username');
    }
    if (!(await new accountService().isUserAuthorized(user, thisUser))) {
      throw new Error('Unauthorized');
    }
    return await notification.updateMany({ username: direct_name, destId: thisUser._id.toString(), isRead: false }, { isRead: true });
  }
  async getDirectNotification(user, username, direct_name) {
    const thisUser = await User.findOne({ login: username });
    if (!thisUser) {
      throw new Error('Invalid username');
    }
    if (!(await new accountService().isUserAuthorized(user, thisUser))) {
      throw new Error('Unauthorized');
    }
    return await notification.countDocuments({ username: direct_name, destId: thisUser._id.toString(), isRead: false });
  }

  async getNotReadNotification(username) {
    const thisUser = await User.findOne({ login: username });
    const notRead = await notification.find({ destId: thisUser._id.toString(), isRead: false });
    return notRead.length;
  }

  async setAllRead(body, user, username) {
    const thisUser = await User.findOne({ login: username });
    if (!thisUser) {
      throw new Error('Invalid username');
    }
    if (!(await new accountService().isUserAuthorized(user, thisUser))) {
      throw new Error('Unauthorized');
    }
    return await notification.updateMany({ _id: { $in: body }, isRead: false }, { isRead: true });
  }

  async askSMM(smmLogin, username) {
    const thisUser = await User.findOne({ login: username });
    const smm = await User.findOne({ login: smmLogin });
    if (!smm) {
      throw new Error('Invalid SMM');
    }
    if (!thisUser) {
      throw new Error('Invalid username');
    }
    const notif = await notification.create({
      username: username,
      destId: smm._id,
      profile_img: thisUser.img,
      profile_img_content_type: thisUser.img_content_type,
      timestamp: Date.now(),
      type: 'SMM',
      isRead: false,
    });
    await socket.sendNotification(notif);
    return notif;
  }
}
module.exports = NotificationService;
