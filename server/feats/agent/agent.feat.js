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

const featsHelper = require('../feats.helper');
const validators = require('./agent.validators');
const controllers = require('./agent.controllers');

const rawRoutes = {
  findAll: {
    method: 'GET',
    path: '/agent',
    description: 'Find all instances of the model from the data source'
  },
  add: {
    method: 'POST',
    path: '/agent',
    description: 'Create a new instance of the model and persist it into the data source',
  },
  updateSettings: {
    method: 'PUT',
    path: '/agent/{id}/settings',
    description: 'Modified the agent settings',
  },
  findAllSettings: {
    method: 'GET',
    path: '/agent/{id}/settings',
    description: 'Return all the settings of the agent',
  },
  findById: {
    method: 'GET',
    path: '/agent/{id}',
    description: 'Find an agent instance by id from the data source',
  },
  updateById: {
    method: 'PUT',
    path: '/agent/{id}',
    description: 'Update attributes of an agent instance and persist it into the data source',
  },
  findDomainsByAgentId: {
    method: 'GET',
    path: '/agent/{id}/domain',
    description: 'Find list of domains linked with an agent instance specified by id',
  },
  deleteById: {
    method: 'DELETE',
    path: '/agent/{id}',
    description: 'Delete a model instance by id from the datasource',
  },
  findIntentsInDomainByIdByAgentId: {
    method: 'GET',
    path: '/agent/{id}/domain/{domainId}/intent',
    description: 'Find list of intents for the given domain and agent',
  },
  findIntentsByAgentId: {
    method: 'GET',
    path: '/agent/{id}/intent',
    description: 'Find list of intents linked with a model instance specified by id',
  },
  findEntitiesByAgentId: {
    method: 'GET',
    path: '/agent/{id}/entity',
    description: 'Find list of entites linked with a model instance specified by id',
  },
  findDomainByIdByAgentId: {
    method: 'GET',
    path: '/agent/{id}/domain/{domainId}',
    description: 'Find a domain by id that belongs to the specified model instance',
  },
  findByName: {
    method: 'GET',
    path: '/agent/name/{agentName}',
    description: 'Find a model instance by name from the data source',
  },
  findIntentByIdInDomainByIdByAgentId: {
    method: 'GET',
    path: '/agent/{id}/domain/{domainId}/intent/{intentId}',
    description: 'Find an intent by id given a domain and an agent',
  },
  findIntentScenarioInDomainByIdByAgentId: {
    method: 'GET',
    path: '/agent/{id}/domain/{domainId}/intent/{intentId}/scenario',
    description: 'Find the scenario related with an intent, for the given domain and agent',
  },
  train: {
    method: 'GET',
    path: '/agent/{id}/train',
    description: 'Train the specified agent with the rules of intents/entities',
  },
  findEntityByIdByAgentId: {
    method: 'GET',
    path: '/agent/{id}/entity/{entityId}',
    description: 'Find an entity by id that belongs to the specified agent',
  },
  converse: {
    method: 'GET',
    path: '/agent/{id}/converse',
    description: 'Converse with an already trained agent',
  },
  exportContent: {
    method: 'GET',
    path: '/agent/{id}/export',
    description: 'Download a csv file with agent content (domains, intents, entities...)',
  },
};

/**
 * Register the routes
 * @param {object} app Application.
 */
function register(app) {
  const authDefault = {
    strategy: 'main',
    scope: ['collaborator', 'admin']
  };

  const routes = featsHelper.applyAuthRules(rawRoutes, authDefault);

  app.register('agent', routes, validators, controllers);
}

module.exports = register;
