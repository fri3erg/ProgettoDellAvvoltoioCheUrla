const User = require('../model/user');
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

    console.log(notifications);

    if (!notifications) {
      return res.status(400).json({ message: 'No notifications found' });
    }

    for (const n of notifications) {
      ret.push(n);
    }
    return ret;
  }

  async deleteNotification(user, username, id) {
    const thisUser = await User.findOne({ login: username });
    if (!thisUser) {
      throw new Error('Invalid username');
    }
    if (!(await new accountService().isUserAuthorized(user, thisUser))) {
      throw new Error('Unauthorized');
    }

    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: `You must give a valid id: ${id}` });
    }

    const deleteNotification = await notification.findById(id).exec();

    if (!deleteNotification) {
      return res.status(400).json({ message: `Can't find a notification with id: ${id}` });
    }

    const result = await deleteNotification.deleteOne();

    if (!result) {
      return res.status(400).json({ message: `Can't delete the notification with id: ${id}` });
    }
    return;
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

  async createNotification(message) {
    let newNotification = new notification({
      username: message.username,
      reaction: message.reaction,
      body: message.body,
      destId: message.destId,
      timestamp: message.timestamp,
      type: message.type,
      isRead: message.isRead,
    });

    newNotification = await message.save();

    if (!newNotification) {
      throw new Error('could not create');
    }
    return newNotification;
  }

  async getNotReadNotification(username) {
    const thisUser = await User.findOne({ login: username });
    const notRead = await notification.find({ destId: thisUser._id.toString(), isRead: false });
    return notRead.length;
  }
}

module.exports = NotificationService;
