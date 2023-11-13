const { OpenAI } = require('openai');
require('dotenv').config();
const Squeal = require('../model/squeal');
const squealService = require('./SquealService');
class CronService {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  async updateLoc() {}

  async GptSqueal() {
    const chatCompletion = await this.openai.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: 'tell ONE between an original fun fact OR a pun , but make it SHORT and just give one of the two responses',
        },
      ],
      model: 'gpt-3.5-turbo',
    });

    return chatCompletion.choices[0].message.content;
  }
  async tempSqueal() {
    const user = {
      user_id: '653fada9242fae4b641c1e84',
      username: 'user',
    };
    const message = await this.GptSqueal();
    if (!message) {
      throw new Error('referencing squeal not found');
    }
    const username = 'user';

    const squeal = {
      body: message,
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
