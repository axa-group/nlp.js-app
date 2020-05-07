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
const validators = require('./intent.validators');
const controllers = require('./intent.controllers');

const rawRoutes = {
  add: {
    method: 'POST',
    path: '/intent',
    description: 'Create a new instance of the model and persist it into the data source',
  },
  findById: {
    method: 'GET',
    path: '/intent/{id}',
    description: 'Find a model instance by id from the datasource',
  },
  updateById: {
    method: 'PUT',
    path: '/intent/{id}',
    description: 'Update attributes for a model instance and persist it into the data source',
  },
  deleteById: {
    method: 'DELETE',
    path: '/intent/{id}',
    description: 'Delete a model instance by id from the data source',
  },
  addScenario: {
    method: 'POST',
    path: '/intent/{id}/scenario',
    description: 'Create a new instance of a scenario for the intent and persist it into the data source',
  },
  findScenario: {
    method: 'GET',
    path: '/intent/{id}/scenario',
    description: 'Find a scenario by intent id from the data source',
  },
  updateScenario: {
    method: 'PUT',
    path: '/intent/{id}/scenario',
    description: 'Update attributes of the scenario of the intent and persist it into the data source',
  },
  deleteScenario: {
    method: 'DELETE',
    path: '/intent/{id}/scenario',
    description: 'Delete a scenario instance by id from the data source',
  },
};

/**
 * Register endpoints.
 * @param {object} app Application.
 */
function register(app) {
  const authDefault = {
    strategy: 'main',
    scope: ['collaborator', 'admin']
  };

  const routes = featsHelper.applyAuthRules(rawRoutes, authDefault);

  app.register('intent', routes, validators, controllers);
}

module.exports = register;
