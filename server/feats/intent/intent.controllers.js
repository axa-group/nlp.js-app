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

const app = require('../../app');
const Logger = require('../../common/logger');
const { Model } = require('../../constants');
const { AgentStatus } = require('../agent/agent.constants');
const { updateAgentStatus } = require('../agent/agent.controllers');

const logger = Logger.getInstance();

/**
 * Adds a new intent.
 * @param {object} request Request
 */
async function add(request) {
  const updateData = JSON.parse(request.payload);
  const agentName = updateData.agent;

  const domain = await app.database.findById(Model.Domain, updateData.domain);
  if (!domain) {
    return app.error(404, 'The domain was not found');
  }

  if (!updateData.intentName) {
    return app.error(400, 'Intent name is mandatory');
  }

  const agent = await updateAgentStatus({ agentName }, AgentStatus.OutOfDate);

  const itemWithTheSameName = await app.database.findOne(Model.Intent, {
    intentName: updateData.intentName,
    agent: agent._id.toString()
  });

  if (itemWithTheSameName) {
    return app.error(400, 'Intent name already used');
  }

  // eslint-disable-next-line no-underscore-dangle
  updateData.agent = agent._id.toString();
  // eslint-disable-next-line no-underscore-dangle
  updateData.domain = domain._id.toString();
  updateData.domainName = domain.domainName;
  return app.database.save(Model.Intent, updateData);
}

/**
 * Finds an intent by id.
 * @param {object} request Request.
 */
async function findById(request) {
  const intentId = request.params.id;
  const intent = await app.database.findById(Model.Intent, intentId);
  if (!intent) {
    return app.error(404, 'The intent was not found');
  }
  const agent = await app.database.findById(Model.Agent, intent.agent);
  if (!agent) {
    return app.error(404, 'The agent was not found');
  }
  intent.agentName = agent.agentName;
  const domain = await app.database.findById(Model.Domain, intent.domain);
  if (!domain) {
    return app.error(404, 'The domain was not found');
  }
  intent.domainName = domain.domainName;
  return intent;
}

/**
 * Delete intent by id.
 * @param {object} request Request
 */
async function deleteById(request) {
  const intentId = request.params.id;
  const intent = await app.database.findById(Model.Intent, intentId);
  if (intent) {
    await updateAgentStatus({ _id: intent.agent }, AgentStatus.OutOfDate);
  }
  app.database.remove(Model.Scenario, { intent: intentId });
  return app.database.removeById(Model.Intent, intentId);
}

/**
 * Update intent by id.
 * @param {object} request Request
 */
async function updateById(request) {
  const intentId = request.params.id;
  const intent = await app.database.findById(Model.Intent, intentId);

  if (!intent) {
    return app.error(400, 'Intent doesn\'t exist');
  }
  await updateAgentStatus({ _id: intent.agent }, AgentStatus.OutOfDate);

  const data = JSON.parse(request.payload);

  if (!data.intentName) {
    return app.error(400, 'Intent name is mandatory');
  }

  if (data.intentName !== intent.intentName) {
    const itemsWithTheSameName = await app.database.find(Model.Intent, {
      intentName: new RegExp(data.intentName, 'i'),
      agent: intent.agent
    });
  
    const otherItems = itemsWithTheSameName.filter(sameNameItem => sameNameItem._id.toString() !== intentId);
  
    if (otherItems.length) {
      return app.error(400, 'Intent name already used');
    }
  }

  return app.database.updateById(Model.Intent, intentId, data);
}

/**
 * Adds scenario to the intent.
 * @param {object} request Request
 */
async function addScenario(request) {
  const updateData = JSON.parse(request.payload);
  const agentName = updateData.agent;

  let agent = await app.database.findOne(Model.Agent, { agentName });
  if (!agent) {
    agent = await app.database.findById(Model.Agent, agentName);
    if (!agent) {
      return app.error(404, 'The agent was not found');
    }
  }
  let { domainName } = updateData;
  if (!domainName) {
    domainName = updateData.domain;
  }

  let domain = await app.database.findOne(Model.Domain, {
    domainName,
    agent: agent._id.toString()
  });
  if (!domain) {
    domain = await app.database.findById(Model.Domain, domainName);
    if (!domain) {
      return app.error(404, 'The domain was not found');
    }
  }
  const intentName = updateData.intent;
  const intent = await app.database.findOne(Model.Intent, {
    intentName,
    domain: domain._id.toString()
  });
  if (!intent) {
    return app.error(404, 'The intent was not found');
  }
  // eslint-disable-next-line no-underscore-dangle
  app.database.remove(Model.Scenario, { intent: intent._id });
  agent.status = AgentStatus.OutOfDate;
  await app.database.saveItem(agent);
  // eslint-disable-next-line no-underscore-dangle
  updateData.agent = agent._id.toString();
  // eslint-disable-next-line no-underscore-dangle
  updateData.domain = domain._id.toString();
  // eslint-disable-next-line no-underscore-dangle
  updateData.intent = intent._id.toString();
  return app.database.save(Model.Scenario, updateData);
}

/**
 * Update scenario.
 * @param {object} request Request
 */
async function updateScenario(request) {
  const updateData = JSON.parse(request.payload);
  const intentId = request.params.id;
  const scenario = await app.database.findOne(Model.Scenario, { intent: intentId });
  if (!scenario) {
    return app.error(404, 'The scenario was not found');
  }
  await updateAgentStatus({ _id: scenario.agent }, AgentStatus.OutOfDate);

  // eslint-disable-next-line no-underscore-dangle
  return app.database.updateById(Model.Scenario, scenario._id, updateData);
}

/**
 * Delete scenario.
 * @param {object} request Request
 */
async function deleteScenario(request) {
  const intentId = request.params.id;
  const intentFilter = { intent: intentId };
  const scenario = await app.database.findOne(Model.Scenario, intentFilter);
  if (!scenario) {
    return app.error(404, 'The scenario was not found');
  }
  await updateAgentStatus({ _id: scenario.agent }, AgentStatus.OutOfDate);

  return app.database.remove(Model.Scenario, intentFilter);
}

/**
 * Find scenario
 * @param {object} request Request
 */
async function findScenario(request) {
  const intentId = request.params.id;
  const intent = await app.database.findById(Model.Intent, intentId);
  if (!intent) {
    return app.error(404, 'The intent was not found');
  }
  const scenario = await app.database.findOne(Model.Scenario, { intent: intentId });
  if (!scenario) {
    return app.error(404, 'The scenario was not found');
  }
  const agent = await app.database.findById(Model.Agent, scenario.agent);
  if (!agent) {
    return app.error(404, 'The agent was not found');
  }
  const domain = await app.database.findById(Model.Domain, scenario.domain);
  if (!domain) {
    return app.error(404, 'The domain was not found');
  }
  scenario.agentName = agent.agentName;
  scenario.domainName = domain.domainName;
  scenario.intentName = intent.intentName;
  return scenario;
}

module.exports = {
  add,
  findById,
  deleteById,
  updateById,
  addScenario,
  findScenario,
  deleteScenario,
  updateScenario,
};
