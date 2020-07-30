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

function findById(table, id) {
  return new Promise((resolve, reject) => {
    const params = {
      TableName: table,
      KeyConditionExpression: `id=:id`,
      ExpressionAttributeValues: {
        ':id': id,
      }
    }
    docClient.query(params, (err, data) => {
      if (err) {
        return reject(err);
      }
      return resolve(data.Items[0]);
    });
  });
}

function save(table, data) {
  return new Promise((resolve, reject) => {
    const params = {
      TableName: table,
      Item: Object.assign({}, data),
    }
    if (!params.Item.id) {
      params.Item.id = uuid.v4();
    }
    docClient.put(params, (err, data) => {
      if (err) {
        return reject(err);
      }
      return resolve(params.Item);
    });
  });
}

function getConversation(agentId, id, autocreate = false) {
  return new Promise(async (resolve, reject) => {
    if (!agentId || (!id && !autocreate)) {
      return resolve(undefined);
    }
    if (id) {
      const conversation = await findById('conversations', id);
      if (!conversation || conversation.agentId !== agentId) {
        return resolve(undefined);
      }
      return resolve(conversation);
    }
    const agent = await findById('agents', agentId);
    if (!agent) {
      return resolve(undefined);
    }
    const conversation = {
      agentId,
      watermark: 0,
    }
    const result = await save('conversations', conversation);
    return resolve(result);
  });
}

function findByForeignKey(table, propName, id) {
  return new Promise((resolve, reject) => {
    const varName = `:${propName}`;
    const params = {
      TableName: table,
      KeyConditionExpression: `${propName}=${varName}`,
      ExpressionAttributeValues: {
        [varName]: id,
      }
    }
    docClient.query(params, (err, data) => {
      if (err) {
        return reject(err);
      }
      return resolve(data.Items[0]);
    });
  });
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

function findActivities(conversationId) {
  return new Promise((resolve, reject) => {
    const params = {
      TableName: 'activities',
      FilterExpression: '#conversationid = :conversationid',
      ExpressionAttributeValues: {
        ':conversationid': conversationId,
      },
      ExpressionAttributeNames: {
        '#conversationid': 'conversationId',
      },
    }
    docClient.scan(params, (err, data) => {
      if (err) {
        return reject(err);
      }
      return resolve(data.Items);
    });
  });
}

module.exports = {
  getAllAgents,
  getAgentByIdOrName,
  getConversation,
  findByForeignKey,
  getTraining,
  save,
  findActivities,
}