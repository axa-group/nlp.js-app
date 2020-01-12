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
 * Adds a new domain.
 * @param {object} request Request
 */
async function add(request) {
  const data = JSON.parse(request.payload);
  const agentName = data.agent;
  const agent = await app.database.findOne(Model.Agent, { agentName });

  if (!agent) {
    return app.error(404, 'The agent was not found');
  }
  const agentId = agent._id.toString();
  const domain = await app.database.findOne(Model.Domain, {
    agent: agentId,
    domainName: new RegExp(data.domainName, 'i')
  });

  if (domain) {
    return app.error(400, 'Domain name already used');
  }

  // eslint-disable-next-line no-underscore-dangle
  data.agent = agentId;

  return app.database.save(Model.Domain, data);
}

/**
 * Find a domain by id.
 * @param {object} request Request
 */
async function findById(request) {
  const domainId = request.params.id;
  const domain = await app.database.findById(Model.Domain, domainId);
  if (!domain) {
    return app.error(404, 'The domain was not found');
  }
  const agent = await app.database.findById(Model.Agent, domain.agent);
  if (!agent) {
    return app.error(404, 'The agent was not found');
  }
  domain.agentName = agent.agentName;
  return domain;
}

/**
 * Delete domain by id.
 * @param {object} request Request
 */
async function deleteById(request) {
  const domainId = request.params.id;

  const domain = await app.database.findById(Model.Domain, domainId);
  await updateAgentStatus({ _id: domain.agent }, AgentStatus.OutOfDate);
  await app.database.remove(Model.Intent, { domain: domainId });
  await app.database.remove(Model.Scenario, { domain: domainId });

  return app.database.removeById(Model.Domain, domainId);
}

async function updateDependingIntents(agentId, domainId, newDomainName) {
  const dependingIntents = await app.database.find(Model.Intent, {
    domain: domainId,
    agent: agentId
  });

  logger.info(`Depending intents... (${dependingIntents.length})`);

  if (dependingIntents) {
    for (const dependingIntent of dependingIntents) {
      const dependingIntentId = dependingIntent._id.toString();

      dependingIntent.domainName = newDomainName;
      await app.database.updateById(Model.Intent, dependingIntentId, dependingIntent);
    }
  }
}

/**
 * Update domain by id.
 * @param {object} request Request
 */
async function updateById(request) {
  const domainId = request.params.id;
  const data = JSON.parse(request.payload);
  const newDomainName = data.domainName;

  const domain = await app.database.findById(Model.Domain, domainId);

  if (newDomainName !== domain.domainName) {
    logger.info(`updateDependingIntent agentId ${domain.agent} old: ${domain.domainName} new: ${newDomainName}`);
    const itemsWithTheSameName = await app.database.find(Model.Domain, {
      domainName: new RegExp(newDomainName, 'i'),
      agent: domain.agent
    });
    const otherItems = itemsWithTheSameName.filter(sameNameItem => sameNameItem._id.toString() !== domainId);
  
    if (otherItems.length) {
      return app.error(400, 'Domain name already used');
    }
    await updateDependingIntents(domain.agent, domainId, newDomainName);
  }

  return app.database.updateById(Model.Domain, domainId, data);
}

/**
 * Find intents of the domain.
 * @param {object} request Request
 */
async function findIntentsByDomainId(request) {
  const domainId = request.params.id;
  const intents = await app.database.find(Model.Intent, { domain: domainId });
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
