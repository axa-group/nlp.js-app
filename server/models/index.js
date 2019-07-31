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

const AgentModel = require('./agent.model');
const ContextModel = require('./context.model');
const DomainModel = require('./domain.model');
const EntityModel = require('./entity.model');
const ExampleModel = require('./example.entity.model');
const IntentModel = require('./intent.model');
const IntentExampleModel = require('./example.intent.model');
const IntentEntityModel = require('./entity.intent.model');
const ScenarioModel = require('./scenario.model');
const SlotModel = require('./slot.scenario.model');
const WebhookModel = require('./webhook.model');
const PostFormatModel = require('./postFormat.model');

module.exports = {
  AgentModel,
  ContextModel,
  DomainModel,
  EntityModel,
  ExampleModel,
  IntentModel,
  IntentExampleModel,
  IntentEntityModel,
  ScenarioModel,
  SlotModel,
  WebhookModel,
  PostFormatModel,
};
