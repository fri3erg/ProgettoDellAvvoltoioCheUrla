const Squeal = require('../model/squeal');
const SquealDestination = require('../model/squealDestination');
const ChannelUser = require('../model/channelUser');
const Channel = require('../model/channel');
const SquealCat = require('../model/squealCat');
const SquealReaction = require('../model/squealReaction');
const SquealViews = require('../model/squealViews');
const User = require('../model/user');
const { isModuleNamespaceObject } = require('util/types');
const squealService = require('./SquealService');
class CronService {
  async tempSqueal() {
    const user = {
      user_id: '653fada9242fae4b641c1e84',
      username: 'user',
    };

    const username = 'user';

    const squeal = {
      body: 'cron',
      destination: [
        {
          admin_add: true,
          destination: '#public',
          destination_id: '6540d9927a3f3d454c20e62d',
          destination_type: 'PUBLICGROUP',
          seen: 0,
        },
      ],
    };
    return await new squealService().insertOrUpdate(squeal, user, username);
  }
}
module.exports = CronService;
