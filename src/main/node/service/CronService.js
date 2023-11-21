const OpenAI = require('openai');
require('dotenv').config();
const Squeal = require('../model/squeal');
const Channel = require('../model/channel');
const User = require('../model/user');
const squealService = require('./SquealService');
const squealViews = require('../model/squealViews');
class CronService {
  async GptSqueal() {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      temperature: 1,
    });
    let user = await User.findOne({ login: 'squealbot' });
    if (!user) {
      user = await User.create({
        first_name: 'bot',
        last_name: 'dello squeallo',
        login: 'squealbot',
        password: 'canny',
        email: 'squealerfrigo@gmail.com',
        activated: true,
        img: '',
        img_content_type: '',
        lang_key: 'en',
        authorities: ['ROLE_USER', 'ROLE_SMM', 'ROLE_ADMIN', 'ROLE_VIP'],
      });
    }
    let channel = await Channel.findOne({ name: '§GPT_JOKES', type: 'MOD' });
    if (!channel) {
      channel = await Channel.create({
        name: '§GPT_JOKES',
        type: 'MOD',
      });
    }
    const chatCompletion = await openai.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: 'tell me a joke',
        },
      ],
      model: 'gpt-3.5-turbo',
    });

    const message = chatCompletion.choices[0].message.content;

    if (!message) {
      throw new Error('referencing squeal not found');
    }
    const username = 'squealbot';

    const squeal = {
      user_id: user._id.toString(),
      body: message,
      timestamp: Date.now(),
      n_characters: message.length,

      destination: [
        {
          admin_add: true,
          destination: channel.name,
          destination_id: channel._id.toString(),
          destination_type: 'MOD',
          seen: 0,
        },
      ],
    };
    await new squealService().insertOrUpdate(squeal, user, username);
    return;
  }
  async tempSqueal() {
    this.GptSqueal();
    this.randomSqueal();
  }
  async randomSqueal() {
    const max = await Squeal.countDocuments();
    const rand = Math.floor(Math.random() * max);
    let squeal = await Squeal.find().skip(rand).limit(1);
    squeal = squeal[0];
    let channel = await Channel.findOne({ name: '§RANDOM_SQUEAL', type: 'MOD' });
    if (!channel) {
      channel = await Channel.create({
        name: '§RANDOM_SQUEAL',
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
  async addCatModChannel(squealCat) {
    const squeal = await Squeal.findById(squealCat.squeal_id);
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
}
module.exports = CronService;
