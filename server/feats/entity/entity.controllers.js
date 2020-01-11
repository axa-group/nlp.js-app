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

const Logger = require('../../common/logger');
const app = require('../../app');
const { Model } = require('../../constants');
const { AgentStatus } = require('../agent/agent.constants');
const { updateAgentStatus } = require('../agent/agent.controllers');

const logger = Logger.getInstance();

async function add(request) {
  const updateData = JSON.parse(request.payload);
  const agentName = updateData.agent;
  const agent = await updateAgentStatus({ agentName }, AgentStatus.OutOfDate);

  const agentId = agent._id.toString();
  const entity = await app.database.findOne(Model.Entity, {
    agent: agentId,
    entityName: new RegExp(updateData.entityName, 'i')
  });

  if (entity) {
    return app.error(400, 'Entity name already used');
  }
  // eslint-disable-next-line no-underscore-dangle
  updateData.agent = agentId;

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

  logger.info(`Found ${intents.length} intents related with entity`);

  intents.forEach(intent => {
    intent.examples.forEach(example => {
      example.entities = example.entities.filter(item => (item.entityId !== entityId));
    });
    logger.info(`Adding new version of intent ${JSON.stringify(intent)}`);
    intentUpdates.push(app.database.saveItem(intent));
  });

  if (intentUpdates.length) {
    logger.info(`updating ${intentUpdates.length} intents`);
    try {
      await Promise.all(intentUpdates);
    } catch(error) {
      logger.error(`Error intents: ${error}`);
    }
  }
}

async function removeEntityFromScenarios(entity) {
  const scenarioUpdates = [];
  const scenarioQuery = { 'slots.entity': entity.entityName, agent: entity.agent };
  const scenarios = await app.database.find(Model.Scenario, scenarioQuery);

  logger.info(`Found ${scenarios.length} scenarios related with entity`);

  scenarios.forEach(scenario => {
    scenario.slots = scenario.slots.filter(slot => slot.entity !== entity.entityName);
    logger.info(`Adding new version of scenario ${JSON.stringify(scenario)}`);
    scenarioUpdates.push(app.database.saveItem(scenario));
  });

  if (scenarioUpdates.length) {
    logger.info(`updating ${scenarioUpdates.length} scenarios`);
    try {
      await Promise.all(scenarioUpdates);
    } catch(error) {
      logger.error(`Error intents: ${error}`);
    }
  }
}

async function deleteById(request) {
  const entityId = request.params.id;
  const entity = await app.database.findById(Model.Entity, entityId);

  logger.info(`Deleting entity ${entity.entityName} (${entityId})...`);

  if (!entity) {
    return app.error(404, 'The entity was not found');
  }

  await updateAgentStatus({ _id: entity.agent }, AgentStatus.OutOfDate);
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
  const intents = await app.database.find(Model.Intent, { agent: agentId });
  const domains = await app.database.find(Model.Domain, { agent: agentId });
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

async function updateDependingScenarios(agentId, oldEntityName, newEntityName) {
  console.log('updateDependingScenarios agentId', agentId,' oldEntityName',oldEntityName,' newEntityName',newEntityName);
  const dependingScenarios = await app.database.find(Model.Scenario, {
    'slots.entity': oldEntityName,
    agent: agentId
  });
  logger.info(`Depending scenarios... (${dependingScenarios.length})`);
  if (dependingScenarios) {
    for (const scenario of dependingScenarios) {
      scenario.slots.forEach(slot => {
        if (slot.entity === oldEntityName) {
          slot.entity = newEntityName;
        }
      });
      logger.info(`Updated scenario occurrence "${scenario.scenarioName}"`);
      await app.database.updateById(Model.Scenario, scenario._id.toString(), scenario);
    }
  }
}

async function updateDependingIntents(entityId, newEntityName) {
  const dependingIntents = await app.database.find(Model.Intent, {
    'examples.entities.entityId': entityId
  });

  logger.info(`Depending intents... (${dependingIntents.length})`);
  if (dependingIntents) {
    for(const dependingIntent of dependingIntents) {
      if (intentContainsEntity(dependingIntent, entityId)) {
        dependingIntent.examples.forEach(example => {
          if (example.entities && example.entities.length) {
            example.entities.forEach(entityOccurrence => {
              if (entityOccurrence.entityId === entityId) {
                logger.info(`Updated entity occurrence in intent "${dependingIntent.intentName}"`);
                entityOccurrence.entity = newEntityName;
              }
            });
          }
        });
        const dependingIntentId = dependingIntent._id.toString();
        await app.database.updateById(Model.Intent, dependingIntentId, dependingIntent);
      }
    }
  }
}

async function updateById(request) {
  const entityId = request.params.id;
  const entity = await app.database.findById(Model.Entity, entityId);

  if (!entity) {
    return app.error(404, 'The entity was not found');
  }
  const agent = await app.database.findById(Model.Agent, entity.agent);

  const data = JSON.parse(request.payload);
  const newEntityName = data.entityName;
  const oldEntityName = entity.entityName;
  const agentId = agent._id.toString();
  logger.info(`Updating entity name: "${oldEntityName}" to "${newEntityName}"`);

  await updateAgentStatus({ _id: agentId }, AgentStatus.OutOfDate);

  const itemsWithTheSameName = await app.database.find(Model.Entity, {
    entityName: new RegExp(newEntityName, 'i'),
    agent: agentId
  });
  const otherItems = itemsWithTheSameName.filter(sameNameItem => sameNameItem._id.toString() !== entityId);

  if (otherItems.length) {
    if (agent.status === AgentStatus.OutOfDate) {
      await updateAgentStatus({ _id: agentId }, agent.status);
    }
    return app.error(400, 'Entity name already used');
  }

  await updateDependingIntents(entityId, newEntityName);
  await updateDependingScenarios(agentId, oldEntityName, newEntityName);

  return await app.database.updateById(Model.Entity, entityId, data);
}

module.exports = {
  add,
  findById,
  deleteById,
  findIntentsByEntityId,
  updateById
};
