const Squeal = require('../model/squeal');
const Destination = require('../model/destination');
const channelUser = require('../model/channelUser');
class SquealService {
  getSquealList(page, size, id) {
    console.log('2');
    const chUs = channelUser.find({ user_id: id });
    console.log('3');

    let chId = [];
    for (let i = 0; i < chUs.length; i++) {
      chId.push(chUs[i]._id);
    }

    console.log('4');

    return Squeal.find({ destination: { destination_id: chId } }).sort({ timestamp: -1 });
  }
}
module.exports = SquealService;
