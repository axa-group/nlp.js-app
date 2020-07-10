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

const AWS = require('aws-sdk');
const uuid = require('uuid');
const jwt = require('jsonwebtoken');
const { NlpManager } = require('node-nlp');

const jwtSecret = process.env.CONVERSATION_JWT_SECRET || 'Th1s 1s V3ry S3cr3t';

AWS.config.update({
  region: process.env.MY_AWS_REGION,
  accessKeyId: process.env.MY_AWS_USER_ID,
  secretAccessKey: process.env.MY_AWS_USER_PASSWORD,
});

const docClient = new AWS.DynamoDB.DocumentClient();

function getAllAgents() {
  return new Promise((resolve, reject) => {
    const params = { TableName: 'agents' };
    docClient.scan(params, (err, data) => {
      if (err) {
        return reject(err);
      }
      return resolve(data.Items);
    })
  });
}

function getAgentByIdOrName(agents, agentId) {
  for (let i = 0; i < agents.length; i += 1) {
    const agent = agents[i];
    if (agent.id === agentId || agent.agentName.toLowerCase() === agentId.toLowerCase()) {
      return agent;
    }
  }
  return undefined;
}

function getTraining(agentId) {
  return new Promise((resolve, reject) => {
    const params = {
      TableName: 'trainings',
      FilterExpression: '#agentid = :agentid',
      ExpressionAttributeValues: {
        ':agentid': agentId,
      },
      ExpressionAttributeNames: {
        '#agentid': 'agentId',
      },
    }
    docClient.scan(params, (err, data) => {
      if (err) {
        return reject(err);
      }
      return resolve(data.Items[0]);
    });
  });
}

async function getToken(agentId, res) {
  const allAgents = await getAllAgents();
  const agent = agentId ? getAgentByIdOrName(allAgents, agentId) : allAgents[0];
  if (!agentId) {
    return res.status(404).send('Agent not found');
  }
  const conversationId = uuid.v4();
  const payload = {
    sub: 'chatbot-user',
    agentId: agent.id,
    conversationId: conversationId,
  };
  const token = jwt.sign(payload, jwtSecret, { algorithm: 'HS256' });
  return res.status(200).send({ token });
}

async function converse(token, text, res) {
  try {
    const payload = jwt.verify(token, jwtSecret);
    const training = await getTraining(payload.agentId);
    if (!training || !training.model) {
      return res.status(200).send('I have problems connecting to my brain');
    }
    const manager = new NlpManager();
    manager.import(training.model);
    const result = await manager.process(text);
    return res.status(200).send(result.answer);
  } catch(err) {
    return res.status(404).send('Agent not found');
  }
}

module.exports = {
  getToken,
  converse,
}


