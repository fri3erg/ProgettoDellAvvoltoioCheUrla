const Squeal = require('../model/squeal');
const SquealDestination = require('../model/squealDestination');
const ChannelUser = require('../model/channelUser');
const Channel = require('../model/channel');
const SquealCat = require('../model/squealCat');
const SquealReaction = require('../model/squealReaction');
const SquealViews = require('../model/squealViews');
const User = require('../model/user');
const { isModuleNamespaceObject } = require('util/types');
const channelUserService = require('../service/ChannelUserService');
const accountService = require('../service/AccountService');
const notification = require('../model/notification');

class NotificationService {
  async getNotification(page, size, user, username) {
    const thisUser = await User.findOne({ login: username });
    if (!thisUser) {
      throw new Error('Invalid username');
    }
    if (!(await new accountService().isUserAuthorized(user, thisUser))) {
      throw new Error('Unauthorized');
    }
    const filtredNotifications = notification.find({ user: thisUser._id.toString() });
    const total = await filtredNotifications.countDocuments();
    const notifications = await notification
      .find({ user: id })
      .limit(size)
      .skip(size * page)
      .lean();
    if (!notifications) {
      return res.status(400).json({ message: 'No notifications found' });
    }
    console.log('total: ', total);
    return;
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

  //user: smm, username: client
  async createNotification(username, message) {}
}

module.exports = NotificationService;
