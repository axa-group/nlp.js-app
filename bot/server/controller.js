/*
 * Copyright (c) AXA Group Operations Spain S.A.
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

const jwt = require('jsonwebtoken');
const { NlpManager } = require('node-nlp');

const jwtSecret = process.env.CONVERSATION_JWT_SECRET || 'Th1s 1s V3ry S3cr3t';

const {
  save,
  getAllAgents,
  getAgentByIdOrName,
  getConversation,
  getTraining,
  findActivities,
} = require('./data');

async function getToken(req, res) {
  let { agentId } = req.params;
  if (agentId === 'null') {
    agentId = undefined;
  }
  const allAgents = await getAllAgents();
  const agent = agentId ? getAgentByIdOrName(allAgents, agentId) : allAgents[0];
  if (!agent) {
    return res.status(404).send('Agent not found');
  }
  const conversation = await getConversation(agent.id, undefined, true);
  const payload = {
    sub: 'chatbot-user',
    agentId: agent.id,
    conversationId: conversation.id,
  }
  const token = jwt.sign(payload, jwtSecret, { algorithm: 'HS256' });
  return res.status(200).send({ token });
}

async function createConversation(req, res) {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(403).send('No authorization header');
  }
  const bearer = authorization.slice(7);
  try {
    const payload = jwt.verify(bearer, jwtSecret);
    const { agentId, conversationId } = payload;
    const conversation = await getConversation(agentId, conversationId, false);
    if (!conversation) {
      return res.status(404).send('Conversation not found');
    }
    return res.status(200).send({ conversationId, token: bearer});
  } catch (err) {
    return res.status(403).send('Invalid Authorization Header');   
  }
}

async function getActivities(req, res) {
  const { conversationId } = req.params;
  const { authorization } = req.headers;
  const watermark = parseInt(req.query.watermark || 0, 10);
  if (!authorization) {
    return res.status(403).send('No authorization header');
  }
  const bearer = authorization.slice(7);
  try {
    const payload = jwt.verify(bearer, jwtSecret);
    const { agentId, conversationId: payloadConversationId } = payload;
    const conversation = await getConversation(agentId, conversationId, false);
    if (!conversation || conversationId !== payloadConversationId) {
      return res.status(404).send('Conversation not found');
    }
    if (watermark >= conversation.watermark) {
      return res.status(200).send({ activities: [], watermark });
    }
    const activities = [];
    const allActivities = await findActivities(conversationId);
    let maxWatermark = watermark;
    for (let i = 0; i < allActivities.length; i += 1) {
      const activity = allActivities[i];
      if (activity.watermark > watermark) {
        if (activity.watermark > maxWatermark) {
          maxWatermark = activity.watermark;
        }
        activities.push(activity);
      }
    }
    return res.status(200).send({ activities, watermark: maxWatermark});
  } catch (err) {
    return res.status(403).send('Invalid Authorization Header');   
  }
}

async function createActivity(req, res) {
  const { conversationId } = req.params;
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(403).send('No authorization header');
  }
  const bearer = authorization.slice(7);
  let conversation;
  let agentId;
  try {
    const payload = jwt.verify(bearer, jwtSecret);
    agentId = payload.agentId;
    const { conversationId: payloadConversationId } = payload;
    conversation = await getConversation(agentId, conversationId, false);
    if (!conversation || conversationId !== payloadConversationId) {
      return res.status(404).send('Conversation not found');
    }
  } catch (err) {
    return res.status(403).send('Invalid Authorization Header');   
  }
  if (conversation) {
    conversation.watermark += 1;
    await save('conversations', conversation);
    const activity = req.body;
    activity.watermark = conversation.watermark;
    activity.conversationId = conversationId;
    activity.agentId = agentId;
    await save('activities', activity);
    const training = await getTraining(agentId);
    if (!training || !training.model) {
      return res.status(200).send('I have problems connecting to my brain');
    }
    const manager = new NlpManager();
    manager.import(training.model);
    const result = await manager.process(activity.text);
    conversation.watermark += 1;
    await save('conversations', conversation);
    const answerActivity = {
      type: 'message',
      serviceUrl: activity.serviceUrl,
      channelId: activity.channelId,
      conversation: {
        id: conversationId,
      },
      recipient: activity.from,
      locale: activity.locale,
      text: result.answer || 'Sorry, I don\'t understand',
      inputHint : "acceptingInput",
      conversationId,
      agentId,
      watermark: conversation.watermark,
    }
    await save('activities', answerActivity);
    return res.status(200).send({});
  }
}

module.exports = {
  getToken,
  createConversation,
  getActivities,
  createActivity,
}