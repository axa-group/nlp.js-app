/*
 * Copyright (c) AXA Shared Services Spain S.A.
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

const app = require('../../app');

const modelName = 'domain';

async function add(request) {
  const updateData = JSON.parse(request.payload);
  const agentName = updateData.agent;
  const agent = await app.database.findOne('agent', { agentName });
  if (!agent) {
    return app.error(404, 'The agent was not found');
  }
  updateData.status = 'Ready';
  // eslint-disable-next-line no-underscore-dangle
  updateData.agent = agent._id.toString();
  return app.database.save(modelName, updateData);
}

async function findById(request) {
  const domainId = request.params.id;
  const domain = await app.database.findById(modelName, domainId);
  if (!domain) {
    return app.error(404, 'The domain was not found');
  }
  const agent = await app.database.findById('agent', domain.agent);
  if (!agent) {
    return app.error(404, 'The agent was not found');
  }
  domain.agentName = agent.agentName;
  return domain;
}

async function deleteById(request) {
  const domainId = request.params.id;
  return app.database.removeById(modelName, domainId);
}

async function updateById(request) {
  const domainId = request.params.id;
  const data = JSON.parse(request.payload);
  return app.database.updateById(modelName, domainId, data);
}

async function findIntentsByDomainId(request) {
  const domainId = request.params.id;
  const intents = await app.database.find('intent', { domain: domainId });
  return {
    intents: app.database.processResponse(intents),
    total: intents.length,
  };
}

module.exports = {
  add,
  findById,
  deleteById,
  updateById,
  findIntentsByDomainId,
};
