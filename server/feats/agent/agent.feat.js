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

const validators = require('./agent.validators');
const controllers = require('./agent.controllers');

const routes = {
  findAll: [
    'GET',
    '/agent',
    'Find all instances of the model from the data source',
  ],
  add: [
    'POST',
    '/agent',
    'Create a new instance of the model and persist it into the data source',
  ],
  updateSettings: [
    'PUT',
    '/agent/{id}/settings',
    'Modified the agent settings',
  ],
  findAllSettings: [
    'GET',
    '/agent/{id}/settings',
    'Return all the settings of the agent',
  ],
  findById: [
    'GET',
    '/agent/{id}',
    'Find an agent instance by id from the data source',
  ],
  updateById: [
    'PUT',
    '/agent/{id}',
    'Update attributes of an agent instance and persist it into the data source',
  ],
  findDomainsByAgentId: [
    'GET',
    '/agent/{id}/domain',
    'Find list of domains linked with an agent instance specified by id',
  ],
  deleteById: [
    'DELETE',
    '/agent/{id}',
    'Delete a model instance by id from the datasource',
  ],
  findIntentsInDomainByIdByAgentId: [
    'GET',
    '/agent/{id}/domain/{domainId}/intent',
    'Find list of intents for the given domain and agent',
  ],
  findIntentsByAgentId: [
    'GET',
    '/agent/{id}/intent',
    'Find list of intents linked with a model instance specified by id',
  ],
  findEntitiesByAgentId: [
    'GET',
    '/agent/{id}/entity',
    'Find list of entites linked with a model instance specified by id',
  ],
  findDomainByIdByAgentId: [
    'GET',
    '/agent/{id}/domain/{domainId}',
    'Find a domain by id that belongs to the specified model instance',
  ],
  findByName: [
    'GET',
    '/agent/name/{agentName}',
    'Find a model instance by name from the data source',
  ],
  findIntentByIdInDomainByIdByAgentId: [
    'GET',
    '/agent/{id}/domain/{domainId}/intent/{intentId}',
    'Find an intent by id given a domain and an agent',
  ],
  findIntentScenarioInDomainByIdByAgentId: [
    'GET',
    '/agent/{id}/domain/{domainId}/intent/{intentId}/scenario',
    'Find the scenario related with an intent, for the given domain and agent',
  ],
  train: [
    'GET',
    '/agent/{id}/train',
    'Train the specified agent with the rules of intents/entities',
  ],
  findEntityByIdByAgentId: [
    'GET',
    '/agent/{id}/entity/{entityId}',
    'Find an entity by id that belongs to the specified agent',
  ],
  converse: [
    'GET',
    '/agent/{id}/converse',
    'Converse with an already trained agent',
  ],
};

function register(app) {
  app.register('agent', routes, validators, controllers);
}

module.exports = register;
