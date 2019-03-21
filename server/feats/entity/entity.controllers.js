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
const { AgentStatus } = require('../agent/agent.constants');

const modelName = 'entity';

/**
 * Adds a new entity
 * @param {object} request Request
 */
async function add(request) {
  const updateData = JSON.parse(request.payload);
  const agentName = updateData.agent;
  const agent = await app.database.findOne('agent', { agentName });
  if (!agent) {
    return app.error(404, 'The agent was not found');
  }
  agent.status = AgentStatus.OutOfDate;
  app.database.saveItem(agent);
  updateData.status = 'Ready';
  // eslint-disable-next-line no-underscore-dangle
  updateData.agent = agent._id.toString();
  if (!updateData.regex) {
    delete updateData.regex;
  }
  return app.database.save(modelName, updateData);
}

/**
 * Find entity by id.
 * @param {object} request Request
 */
async function findById(request) {
  const entityId = request.params.id;
  const entity = await app.database.findById(modelName, entityId);
  if (!entity) {
    return app.error(404, 'The entity was not found');
  }
  const agent = await app.database.findById('agent', entity.agent);
  if (!agent) {
    return app.error(404, 'The agent was not found');
  }
  entity.agentName = agent.agentName;
  return entity;
}

/**
 * Remove an entity by id.
 * @param {object} request Request.
 */
async function deleteById(request) {
  const entityId = request.params.id;
  const entity = await app.database.findById(modelName, entityId);
  if (entity) {
    const agent = await app.database.findById('agent', entity.agent);
    if (agent) {
      agent.status = AgentStatus.OutOfDate;
      await app.database.saveItem(agent);
    }
  }
  return app.database.removeById(modelName, entityId);
}

/**
 * indicates if an intent uses an entity.
 * @param {object} intent Intent instance.
 * @param {string} entityId Entity identifier.
 */
function intentContainsEntity(intent, entityId) {
  if (!intent.examples) {
    return true;
  }
  for (let i = 0; i < intent.examples.length; i += 1) {
    const example = intent.examples[i];
    if (example.entities) {
      for (let j = 0; j < example.entities.length; j += 1) {
        if (example.entities[j].entityId === entityId) {
          return true;
        }
      }
    }
  }
  return false;
}

/**
 * Given an intent and a list of domains, finds the domain name of the intent.
 * @param {object} intent Intent instance.
 * @param {object[]} domains List of domains.
 */
function getDomainName(intent, domains) {
  for (let i = 0; i < domains.length; i += 1) {
    // eslint-disable-next-line no-underscore-dangle
    if (domains[i]._id === intent.domain) {
      return domains[i].domainName;
    }
  }
  return '';
}

/**
 * Find intents by entity.
 * @param {object} request Request
 */
async function findIntentsByEntityId(request) {
  const entityId = request.params.id;
  const entity = await app.database.findById(modelName, entityId);
  if (!entity) {
    return app.error(404, 'The entity was not found');
  }
  const agentId = entity.agent;
  const agent = await app.database.findById('agent', agentId);
  if (!agent) {
    return app.error(404, 'The agent was not found');
  }
  const intents = await app.database.find('intent', { agent: agentId });
  const domains = await app.database.find('domain', { agent: agentId });
  const result = [];
  for (let i = 0; i < intents.length; i += 1) {
    const intent = intents[i];
    if (intentContainsEntity(intent, entityId)) {
      intent.agentName = agent.agentName;
      intent.domainName = getDomainName(intent, domains);
      result.push(intent);
    }
  }
  return result;
}

/**
 * Updates an entity by id.
 * @param {object} request Request
 */
async function updateById(request) {
  const entityId = request.params.id;
  const entity = await app.database.findById(modelName, entityId);
  if (entity) {
    const agent = await app.database.findById('agent', entity.agent);
    if (agent) {
      agent.status = AgentStatus.OutOfDate;
      await app.database.saveItem(agent);
    }
  }
  const data = JSON.parse(request.payload);
  return app.database.updateById(modelName, entityId, data);
}

module.exports = {
  add,
  findById,
  deleteById,
  findIntentsByEntityId,
  updateById,
};
