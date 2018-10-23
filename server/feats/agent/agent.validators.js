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

const Joi = require('joi');
const {
  AgentModel,
  DomainModel,
  EntityModel,
  IntentModel,
} = require('../../models');

module.exports = {
  findAll: {
    query: (() => ({
      start: Joi.number().description(
        'The index of the first element to return. 0 is the default start.'
      ),
      limit: Joi.number().description(
        'Number of elements to return from start. All the elements are returned by default'
      ),
    }))(),
  },
  add: {
    payload: (() => ({
      agentName: AgentModel.agentName.required(),
      description: AgentModel.description,
      language: AgentModel.language
        .valid('en', 'es', 'de', 'fr', 'pt')
        .required()
        .error(new Error('Please provide a valid language for the agent')),
      timezone: AgentModel.timezone.required(),
      useWebhook: AgentModel.useWebhook.required(),
      usePostFormat: AgentModel.usePostFormat.required(),
      domainClassifierThreshold: AgentModel.domainClassifierThreshold.required(),
      fallbackResponses: AgentModel.fallbackResponses
        .required()
        .min(1)
        .error(
          new Error('Please add at least one fallback response for the agent')
        ),
      extraTrainingData: AgentModel.extraTrainingData,
      enableModelsPerDomain: AgentModel.enableModelsPerDomain,
    }))(),
  },
  updateSettings: {
    params: (() => ({
      id: Joi.string()
        .required()
        .description('The id of the agent'),
    }))(),
    payload: (() => Joi.object())(),
  },
  findAllSettings: {
    params: (() => ({
      id: Joi.string()
        .required()
        .description('The id of the agent'),
    }))(),
  },
  findById: {
    params: (() => ({
      id: AgentModel.id.required().description('Id of the agent'),
    }))(),
  },
  updateById: {
    params: (() => ({
      id: AgentModel.id.required().description('Id of the agent'),
    }))(),
    payload: (() => ({
      agentName: AgentModel.agentName,
      description: AgentModel.description,
      language: AgentModel.language
        .valid('en', 'es', 'de', 'fr', 'pt')
        .error(
          new Error(
            'Please provide a valid language for the agent. Supported languages are: en, es, de, fr'
          )
        ),
      timezone: AgentModel.timezone,
      useWebhook: AgentModel.useWebhook,
      usePostFormat: AgentModel.usePostFormat,
      domainClassifierThreshold: AgentModel.domainClassifierThreshold,
      fallbackResponses: AgentModel.fallbackResponses
        .min(1)
        .error(
          new Error('please add at least one fallback response for the agent')
        ),
      status: AgentModel.status,
      lastTraining: AgentModel.lastTraining,
      extraTrainingData: AgentModel.extraTrainingData,
      enableModelsPerDomain: AgentModel.enableModelsPerDomain,
      model: AgentModel.model,
    }))(),
  },
  findDomainsByAgentId: {
    params: (() => ({
      id: AgentModel.id.required().description('Id of the agent'),
    }))(),
    query: () =>
      ({
        start: Joi.number().description(
          'The index of the first element to return. 0 is the default start.'
        ),
        limit: Joi.number().description(
          'Number of elements to return from start. All the elements are returned by default'
        ),
        filter: Joi.string().description(
          'String that will filter values to return only those domains with part of this filter in their names'
        ),
      }()),
  },
  deleteById: {
    params: (() => ({
      id: AgentModel.id.required().description('Id of the agent'),
    }))(),
  },
  findIntentsInDomainByIdByAgentId: {
    params: (() => ({
      id: AgentModel.id.required().description('Id of the agent'),
      domainId: DomainModel.id.required().description('Id of the domain'),
    }))(),
    query: (() => ({
      start: Joi.number().description(
        'The index of the first element to return. 0 is the default start.'
      ),
      limit: Joi.number().description(
        'Number of elements to return from start. All the elements are returned by default'
      ),
      filter: Joi.string().description(
        'String that will filter values to return only those intents with part of this filter in their names'
      ),
    }))(),
  },
  findIntentsByAgentId: {
    params: (() => ({
      id: AgentModel.id.required().description('Id of the agent'),
    }))(),
    query: (() => ({
      start: Joi.number().description(
        'The index of the first element to return. 0 is the default start.'
      ),
      limit: Joi.number().description(
        'Number of elements to return from start. All the elements are returned by default'
      ),
      filter: Joi.string().description(
        'String that will filter values to return only those intents with part of this filter in their names'
      ),
    }))(),
  },
  findEntitiesByAgentId: {
    params: (() => ({
      id: AgentModel.id.required().description('Id of the agent'),
    }))(),
    query: (() => ({
      start: Joi.number().description(
        'The index of the first element to return. 0 is the default start.'
      ),
      limit: Joi.number().description(
        'Number of elements to return from start. All the elements are returned by default'
      ),
      filter: Joi.string().description(
        'String that will filter values to return only those entities with part of this filter in their names'
      ),
    }))(),
  },
  findDomainByIdByAgentId: {
    params: (() => ({
      id: AgentModel.id.required().description('Id of the agent'),
      domainId: DomainModel.id.required().description('Id of the domain'),
    }))(),
  },
  findByName: {
    params: (() => ({
      agentName: AgentModel.agentName
        .required()
        .description('The name of the agent'),
    }))(),
  },
  findIntentByIdInDomainByIdByAgentId: {
    params: (() => ({
      id: AgentModel.id.required().description('Id of the agent'),
      domainId: DomainModel.id.required().description('Id of the domain'),
      intentId: IntentModel.id.required().description('Id of the intent'),
    }))(),
  },
  findIntentScenarioInDomainByIdByAgentId: {
    params: (() => ({
      id: AgentModel.id.required().description('Id of the agent'),
      domainId: DomainModel.id.required().description('Id of the domain'),
      intentId: IntentModel.id.required().description('Id of the intent'),
    }))(),
  },
  train: {
    params: (() => ({
      id: AgentModel.id.required().description('Id of the agent'),
    }))(),
  },
  findEntityByIdByAgentId: {
    params: (() => ({
      id: AgentModel.id.required().description('Id of the agent'),
      entityId: EntityModel.id.required().description('Id of the entity'),
    }))(),
  },
  converse: {
    params: (() => ({
      id: AgentModel.id.required().description('Id of the agent'),
    }))(),
    query: (() => ({
      sessionId: Joi.string()
        .required()
        .description('Id of the session'),
      text: Joi.string()
        .required()
        .description('Text to parse'),
      timezone: Joi.string().description(
        'Timezone for duckling parse. Default UTC'
      ),
    }))(),
  },
};
