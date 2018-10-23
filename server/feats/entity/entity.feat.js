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

const validators = require('./entity.validators');
const controllers = require('./entity.controllers');

const routes = {
  add: [
    'POST',
    '/entity',
    'Create a new instance of the model and persist it into the data source',
  ],
  findById: [
    'GET',
    '/entity/{id}',
    'Find a model instance by id from the data source',
  ],
  findIntentsByEntityId: [
    'GET',
    '/entity/{id}/intent',
    'Find a model instance by id from the data source',
  ],
  updateById: [
    'PUT',
    '/entity/{id}',
    'Update attributes for a model instance and persist it into the data source',
  ],
  deleteById: [
    'DELETE',
    '/entity/{id}',
    'Delete a model instance by id from the data source',
  ],
};

function register(app) {
  app.register('entity', routes, validators, controllers);
}

module.exports = register;
