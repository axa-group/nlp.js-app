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

const validators = require('./intent.validators');
const controllers = require('./intent.controllers');

const routes = {
  add: [
    'POST',
    '/intent',
    'Create a new instance of the model and persist it into the data source',
  ],
  findById: [
    'GET',
    '/intent/{id}',
    'Find a model instance by id from the datasource',
  ],
  updateById: [
    'PUT',
    '/intent/{id}',
    'Update attributes for a model instance and persist it into the data source',
  ],
  deleteById: [
    'DELETE',
    '/intent/{id}',
    'Delete a model instance by id from the data source',
  ],
  addScenario: [
    'POST',
    '/intent/{id}/scenario',
    'Create a new instance of a scenario for the intent and persist it into the data source',
  ],
  findScenario: [
    'GET',
    '/intent/{id}/scenario',
    'Find a scenario by intent id from the data source',
  ],
  updateScenario: [
    'PUT',
    '/intent/{id}/scenario',
    'Update attributes of the scenario of the intent and persist it into the data source',
  ],
  deleteScenario: [
    'DELETE',
    '/intent/{id}/scenario',
    'Delete a scenario instance by id from the data source',
  ],
};

/**
 * Register endpoints.
 * @param {object} app Application.
 */
function register(app) {
  app.register('intent', routes, validators, controllers);
}

module.exports = register;
