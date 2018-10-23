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

const trainer = require('./trainers/nlpjs-trainer');

class App {
  constructor() {
    this.feats = {};
    this.apiPath = '/api';
  }

  getFeat(featName) {
    if (!this.feats[featName]) {
      this.feats[featName] = {};
    }
    return this.feats[featName];
  }

  getOperation(featName, operationName) {
    const feat = this.getFeat(featName);
    if (!feat[operationName]) {
      feat[operationName] = {
        controller: undefined,
        validator: undefined,
        route: undefined,
      };
    }
    return feat[operationName];
  }

  defaultHandle(request, h) {
    return h.response({ name: 'hello' }).code(201);
  }

  validate(operation) {
    return operation.validator || {};
  }

  async handle(operation, request, h) {
    const fn = operation.controller || this.defaultHandle;
    const result = await fn(request, h);
    if (result instanceof Error) {
      return h.response(result.message).code(result.code || 500);
    }
    return this.database.processResponse(result);
  }

  registerRoute(featName, operationName, method, path, description) {
    const operation = this.getOperation(featName, operationName);
    operation.route = {
      method,
      path: `${this.apiPath}${path}`,
      config: {
        description,
        tags: ['api'],
        validate: this.validate(operation),
        handler: this.handle.bind(this, operation),
      },
    };
    return operation.route;
  }

  registerController(featName, operationName, controller) {
    const operation = this.getOperation(featName, operationName);
    operation.controller = controller;
  }

  registerValidator(featName, operationName, validator) {
    const operation = this.getOperation(featName, operationName);
    operation.validator = validator;
  }

  register(featName, routes, validators, controllers) {
    const approutes = [];
    const operationNames = Object.keys(routes);
    operationNames.forEach(operationName => {
      const route = routes[operationName];
      approutes.push(
        this.registerRoute(
          featName,
          operationName,
          route[0],
          route[1],
          route[2]
        )
      );
      this.registerValidator(
        featName,
        operationName,
        validators[operationName]
      );
      this.registerController(
        featName,
        operationName,
        controllers[operationName]
      );
    });
    this.server.route(approutes);
  }

  error(code, message) {
    const result = new Error(message);
    result.code = code;
    return result;
  }

  async train(data) {
    return JSON.parse(await trainer.train(data));
  }

  existsTraining(agentId) {
    return trainer.existsTraining(agentId);
  }

  loadTraining(agentId, model) {
    trainer.loadTraining(agentId, model);
  }

  converse(agentId, session, text) {
    return trainer.converse(agentId, session, text);
  }
}

const instance = new App();

module.exports = instance;
