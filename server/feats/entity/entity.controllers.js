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
const { Model } = require('../../constants');
const { AgentStatus } = require('../agent/agent.constants');

async function add(request) {
  const updateData = JSON.parse(request.payload);
  const agentName = updateData.agent;
  const agent = await app.database.findOne(Model.Agent, { agentName });
  if (!agent) {
    return app.error(404, 'The agent was not found');
  }
  agent.status = AgentStatus.OutOfDate;
  app.database.saveItem(agent, 'agent');
  updateData.status = AgentStatus.Ready;
  // eslint-disable-next-line no-underscore-dangle
  updateData.agent = agent._id.toString();
  if (!updateData.regex) {
    delete updateData.regex;
  }
  return app.database.save(Model.Entity, updateData);
}

async function findById(request) {
  const entityId = request.params.id;
  const entity = await app.database.findById(Model.Entity, entityId);
  if (!entity) {
    return app.error(404, 'The entity was not found');
  }
  const agent = await app.database.findById(Model.Agent, entity.agent);
  if (!agent) {
    return app.error(404, 'The agent was not found');
  }
  entity.agentName = agent.agentName;
  return entity;
}

async function removeEntityFromIntents(entity) {
  const entityId = entity._id.toString();
  const intentUpdates = [];
  const intentQuery = { 'examples.entities.entityId': entityId, agent: entity.agent };
  const intents = await app.database.find(Model.Intent, intentQuery);

  console.log(`Found ${intents.length} intents related with entity`);

  intents.forEach(intent => {
    intent.examples.forEach(example => {
      example.entities = example.entities.filter(entity => (entity.entityId !== entityId));
    });
    console.log('Adding new version of intent', JSON.stringify(intent));
    intentUpdates.push(app.database.saveItem(intent, 'intent'));
  });

  if (intentUpdates.length) {
    console.log(`updating ${intentUpdates.length} intents`);
    try {
      await Promise.all(intentUpdates);
    } catch(error) {
      console.error('Error intents:', error);
    }
  }
}

async function removeEntityFromScenarios(entity) {
  const scenarioUpdates = [];
  const scenarioQuery = { 'slots.entity': entity.entityName, agent: entity.agent };
  const scenarios = await app.database.find(Model.Scenario, scenarioQuery);

  console.log(`Found ${scenarios.length} scenarios related with entity`);

  scenarios.forEach(scenario => {
    scenario.slots = scenario.slots.filter(slot => slot.entity !== entity.entityName);
    console.log('Adding new version of scenario', JSON.stringify(scenario));
    scenarioUpdates.push(app.database.saveItem(scenario, 'scenario'));
  });

  if (scenarioUpdates.length) {
    console.log(`updating ${scenarioUpdates.length} scenarios`);
    try {
      await Promise.all(scenarioUpdates);
    } catch(error) {
      console.error('Error scenarios:', error);
    }
  }
}

async function deleteById(request) {
  const entityId = request.params.id;
  const entity = await app.database.findById(Model.Entity, entityId);

  console.log(`Deleting entity ${entity.entityName} (${entityId})...`);

  if (!entity) {
    return app.error(404, 'The entity was not found');
  }
  const agent = await app.database.findById(Model.Agent, entity.agent);

  if (agent) {
    agent.status = AgentStatus.OutOfDate;
    await app.database.saveItem(agent, 'agent');
  }

  await removeEntityFromIntents(entity);
  await removeEntityFromScenarios(entity);

  return app.database.removeById(Model.Entity, entityId);
}

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

function getDomainName(intent, domains) {
  for (let i = 0; i < domains.length; i += 1) {
    // eslint-disable-next-line no-underscore-dangle
    if (domains[i]._id === intent.domain) {
      return domains[i].domainName;
    }
  }
  return '';
}

async function findIntentsByEntityId(request) {
  const entityId = request.params.id;
  const entity = await app.database.findById(Model.Entity, entityId);
  if (!entity) {
    return app.error(404, 'The entity was not found');
  }
  const agentId = entity.agent;
  const agent = await app.database.findById(Model.Agent, agentId);
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

async function updateById(request) {
  const entityId = request.params.id;
  const entity = await app.database.findById(Model.Entity, entityId);
  if (entity) {
    const agent = await app.database.findById(Model.Agent, entity.agent);
    if (agent) {
      agent.status = AgentStatus.OutOfDate;
      await app.database.saveItem(agent, 'agent');
    }
  }
  const data = JSON.parse(request.payload);
  return app.database.updateById(Model.Entity, entityId, data);
}

module.exports = {
  add,
  findById,
  deleteById,
  findIntentsByEntityId,
  updateById
};
