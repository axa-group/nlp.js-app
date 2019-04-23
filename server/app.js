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
const FileBundle = require('./core/file-bundle');

/**
 * Class for the application.
 */
class App {
  /**
   * Constructor of the class
   */
  constructor() {
    this.feats = {};
    this.apiPath = '/api';
  }

  /**
   * Gets a feat given the feat name.
   * @param {string} featName Name of the feat.
   */
  getFeat(featName) {
    if (!this.feats[featName]) {
      this.feats[featName] = {};
    }
    return this.feats[featName];
  }

  /**
   * Gets an operation given the feat and operation name.
   * @param {string} featName Name of the feat.
   * @param {string} operationName Name of the operation
   */
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

  /**
   * Default hapi handler.
   * @param {object} request Request instance
   * @param {object} h Response instance
   */
  defaultHandle(request, h) {
    return h.response({ name: 'hello' }).code(201);
  }

  /**
   * Gets the operation validator or default.
   * @param {object} operation Operation instance.
   */
  validate(operation) {
    return operation.validator || {};
  }

  /**
   * Handlers for an operation.
   * @param {object} operation Operation instance.
   * @param {object} request Request instance.
   * @param {object} h Response instance.
   */
  async handle(operation, request, h) {
    const fn = operation.controller || this.defaultHandle;
    const result = await fn(request, h);

    if (result instanceof Error) {
      return h.response(result.message).code(result.code || 500);
    } else if(result instanceof FileBundle) {
      return result.content;
    }

    return this.database.processResponse(result);
  }

  /**
   * Register a route in hapi.
   * @param {string} featName Name of the feat.
   * @param {string} operationName Name of the operation.
   * @param {string} method Operation method.
   * @param {string} path Operation path.
   * @param {string} description Operation description.
   */
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

  /**
   * Register a controller for an operation.
   * @param {string} featName Name of the feat.
   * @param {string} operationName Name of the operation.
   * @param {object} controller Controller of the operation.
   */
  registerController(featName, operationName, controller) {
    const operation = this.getOperation(featName, operationName);
    operation.controller = controller;
  }

  /**
   * Register the validator for an operation.
   * @param {string} featName Name of the feat.
   * @param {string} operationName Name of the operation.
   * @param {object} validator Validator of the operation.
   */
  registerValidator(featName, operationName, validator) {
    const operation = this.getOperation(featName, operationName);
    operation.validator = validator;
  }

  /**
   * Register all feat operations.
   * @param {string} featName Name of the feat.
   * @param {object} routes Routes of the feat.
   * @param {object} validators Validators of the feat.
   * @param {object} controllers Controllers of the feat.
   */
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

  /**
   * Creates an error instance.
   * @param {string} code Error code
   * @param {string} message Error message
   */
  error(code, message) {
    const result = new Error(message);
    result.code = code;
    return result;
  }

  /**
   * Trains a model.
   * @param {object} data Training data.
   */
  async train(data) {
    return JSON.parse(await trainer.train(data));
  }

  /**
   * Indicates if an agent has a training.
   * @param {string} agentId Agent identifier.
   */
  existsTraining(agentId) {
    return trainer.existsTraining(agentId);
  }

  /**
   * Loads the training of an agent.
   * @param {string} agentId Agent identifier.
   * @param {object} model Model to load.
   */
  loadTraining(agentId, model) {
    trainer.loadTraining(agentId, model);
  }

  /**
   * Converse with an agent.
   * @param {string} agentId Agent identifier.
   * @param {object} session Session of the conversation.
   * @param {string} text Utterance text.
   */
  converse(agentId, session, text) {
    return trainer.converse(agentId, session, text);
  }
}

const instance = new App();

module.exports = instance;
