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

const validators = require('./domain.validators');
const controllers = require('./domain.controllers');

const routes = {
  add: [
    'POST',
    '/domain',
    'Create a new instance of the model and persist it into the data source',
  ],
  findById: [
    'GET',
    '/domain/{id}',
    'Find a model instance by id from the data source',
  ],
  deleteById: [
    'DELETE',
    '/domain/{id}',
    'Delete a model instance by id from the data source',
  ],
  updateById: [
    'PUT',
    '/domain/{id}',
    'Update attributes for a model instance and persist it into the data source',
  ],
  findIntentsByDomainId: [
    'GET',
    '/domain/{id}/intent',
    'Find list of intents linked with a domain',
  ],
};

/**
 * Register the endpoints.
 * @param {object} app Application.
 */
function register(app) {
  app.register('domain', routes, validators, controllers);
}

module.exports = register;
